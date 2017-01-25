import {
    findMatchingTarget,
    getTime,
    getPoint
} from '../utils.js'

export default class KineticEngine {
    constructor(props) {
        this.hasTouch = 'ontouchstart' in window;
        this.DETECT_EVT = this.hasTouch ? 'touchstart' : 'mouseover';
        this.activeId = undefined;
        this.$listener = props.$listener;
        this.childNodes = props.childNodes;

        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.lastScrollLeft = 0;
        this.lastScrollTop = 0;
        this.targetTop = 0;
        this.targetLeft = 0;

        this.velocityLeft = 0;
        this.velocityTop = 0;
        this.amplitudeLeft = 0;
        this.amplitudeTop = 0;

        this.timeStamp = 0;
        this.referenceX = 0;
        this.referenceY = 0;
        this.pressed = false;
        this.autoScrollTracker = null;
        this.isAutoScrolling = false;

        this.enableKinetics = false;
        this.movingAverage = 0.1;

        this.setActiveNode = this.setActiveNode.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.autoScroll = this.autoScroll.bind(this);

        this.tap = this.tap.bind(this);
        this.swipe = this.swipe.bind(this);
        this.release = this.release.bind(this);
    }

    setActiveNode (e) {
        this.activeId = findMatchingTarget(e.target, this.childNodes);
    }

    leftVelocityTracker () {
        let now = getTime(),
            elapsed = now - this.timeStamp,
            delta = this.scrollLeft - this.lastScrollLeft;

        this.timeStamp = now;
        this.lastScrollLeft = this.scrollLeft;

        this.velocityLeft = this.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityLeft;
    }

    topVelocityTracker () {
        let now = getTime(),
            elapsed = now - this.timeStamp,
            delta = this.scrollTop - this.lastScrollTop;

        this.timeStamp = now;
        this.lastScrollTop = this.scrollTop;

        this.velocityTop = this.movingAverage * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityTop;
    }

    scrollTo (left, top) {
        let correctedLeft = Math.round(left),
            correctedTop = Math.round(top);

        this.childNodes.forEach((node) => {
            let $el = node.children[0];
            let maxScrollX = $el.scrollWidth - $el.clientWidth;
            let maxScrollY = $el.scrollHeight - $el.clientHeight;

            if ( maxScrollX > 0 && correctedLeft >= 0 && correctedLeft <= maxScrollX ) {
                $el.scrollLeft = correctedLeft;
                this.scrollLeft = correctedLeft;
            }
            if ( maxScrollY > 0 && correctedTop >= 0 && correctedTop <= maxScrollY ) {
                $el.scrollTop = correctedTop;
                this.scrollTop = correctedTop;
            }
        })
    }

    onScroll (e) {
        let target = e.target;
        let valX = undefined;
        let valY = undefined;

        if ( this.pressed || this.isAutoScrolling ) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if ( target.clientWidth !== target.scrollWidth ) {
            valX = target.scrollLeft;
            this.lastScrollLeft = this.scrollLeft;
            this.scrollLeft = valX;
        } else {
            valX = this.scrollLeft;
        }
        if ( target.clientHeight !== target.scrollHeight ) {
            valY = target.scrollTop;
            this.lastScrollTop = this.scrollTop;
            this.scrollTop = valY;
        } else {
            valY = this.scrollTop;
        }

        this.childNodes.forEach((node) => {
            if ( node.id !== this.activeId ) {
                node.children[0].scrollLeft = valX;
                node.children[0].scrollTop = valY;
            }
        });
    }

    autoScroll () {
        const TIME_CONST = 325;

        let elapsed = getTime() - this.timeStamp,
            deltaY = 0,
            deltaX = 0,
            scrollX = 0,
            scrollY = 0;

        if ( this.amplitudeTop ) {
            deltaY = -this.amplitudeTop * Math.exp(-elapsed / TIME_CONST);
        }
        if ( this.amplitudeLeft ) {
            deltaX = -this.amplitudeLeft * Math.exp(-elapsed / TIME_CONST);
        }

        if ( deltaX > 0.5 || deltaX < -0.5 ) {
            scrollX = deltaX;
        } else {
            scrollX = 0;
        }

        if ( deltaY > 0.5 || deltaY < -0.5 ) {
            scrollY = deltaY;
        } else {
            scrollY = 0;
        }

        this.scrollTo(this.targetLeft + scrollX, this.targetTop + scrollY);

        if ( scrollX !== 0 || scrollY !== 0 ) {
            this.autoScrollTracker = requestAnimationFrame(this.autoScroll);
        } else {
            this.isAutoScrolling = false;
            this.autoScrollTracker = null;
        }
    }

    cancelAutoScroll () {
        if ( this.isAutoScrolling ) {
            cancelAnimationFrame(this.autoScrollTracker);
            this.isAutoScrolling = false;
            this.autoScrollTracker = null;
        }
    }

    tap (e) {
        let point = getPoint(e, this.hasTouch);

        this.pressed = true;
        this.referenceX = point.x;
        this.referenceY = point.y;

        this.velocityTop = this.amplitudeTop = 0;
        this.velocityLeft = this.amplitudeLeft = 0;

        this.lastScrollTop = this.scrollTop;
        this.lastScrollLeft = this.scrollLeft;

        this.timeStamp = getTime();

        this.cancelAutoScroll();

        this.$listener.addEventListener( 'mousemove', this.swipe, true );
        this.$listener.addEventListener( 'mouseup', this.release, true );
        
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    swipe (e) {
        let point = getPoint(e, this.hasTouch),
            x, y,
            deltaX,
            deltaY;

        if (this.pressed) {
            x = point.x;
            y = point.y;

            deltaX = this.referenceX - x;
            deltaY = this.referenceY - y;

            if (deltaX > 2 || deltaX < -2) {
                this.referenceX = x;
            } else {
                deltaX = 0;
            }
            if (deltaY > 2 || deltaY < -2) {
                this.referenceY = y;
            } else {
                deltaY = 0;
            }

            this.leftVelocityTracker();
            this.topVelocityTracker();

            this.scrollTo( this.scrollLeft + deltaX, this.scrollTop + deltaY );
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    release (e) {
        this.pressed = false;

        this.timeStamp = getTime();

        this.leftVelocityTracker();
        this.topVelocityTracker();

        if (this.velocityTop > 10 || this.velocityTop < -10) {
            this.amplitudeTop = 0.8 * this.velocityTop;
            this.targetTop = Math.round(this.scrollTop + this.amplitudeTop);
        } else {
            this.targetTop = this.scrollTop;
        }
        if (this.velocityLeft > 10 || this.velocityLeft < -10) {
            this.amplitudeLeft = 0.8 * this.velocityLeft;
            this.targetLeft = Math.round(this.scrollLeft + this.amplitudeLeft);
        } else {
            this.targetLeft = this.scrollLeft;
        }

        this.isAutoScrolling = true;
        this.autoScrollTracker = requestAnimationFrame(this.autoScroll);

        this.$listener.removeEventListener( 'mousemove', this.swipe );
        this.$listener.removeEventListener( 'mouseup', this.release );

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    init (options) {
        let defaults = {
            enableKinetics: false,
            movingAverage: 0.1
        };

        let settings = Object.assign(
            {},
            defaults,
            options
        );

        this.enableKinetics = settings.enableKinetics;
        this.movingAverage = settings.movingAverage;

        this.$listener.addEventListener( this.DETECT_EVT, this.setActiveNode, true );
        this.$listener.addEventListener( 'scroll', this.onScroll, true );

        if ( ! this.hasTouch && this.enableKinetics ) {
            this.$listener.addEventListener( 'mousedown', this.tap, true );
        }
    }

    destroy () {
        this.$listener.addEventListener( this.DETECT_EVT, this.setActiveNode, true );
        this.$listener.addEventListener( 'scroll', this.onScroll, true );

        if ( ! this.hasTouch && this.enableKinetics ) {
            this.$listener.removeEventListener( 'mousedown', this.tap );
            this.$listener.removeEventListener( 'mousemove', this.swipe );
            this.$listener.removeEventListener( 'mouseup', this.release );
        }
    }
}
