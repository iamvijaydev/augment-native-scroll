import React, { Component, Children, PropTypes } from 'react';
import { findMatchingTarget, getPoint, getTime } from '../utils.js'

class SynchronousScrollSwipe extends Component {
    constructor(props) {
        super(props);

        this.hasTouch = 'ontouchstart' in window;
        this.DETECT_EVT = this.hasTouch ? 'touchstart' : 'mouseover';

        this.$listener = undefined;
        this.childNodes = [];
        this.activeId = undefined;

        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.lastScrollLeft = 0;
        this.lastScrollTop = 0;
        this.targetTop = 0;
        this.targetLeft = 0;

        this.velocityTop = 0;
        this.velocityLeft = 0;
        this.amplitudeTop = 0;
        this.amplitudeLeft =0;

        this.topTimer = null;
        this.leftTimer = null;
        this.topTracker = this.topTracker.bind(this);
        this.leftTracker = this.leftTracker.bind(this);

        this.pressed = false;
        this.autoScrollTracker = null;
        this.isAutoScrolling = false;

        this.scrollTo = this.scrollTo.bind(this);
        this.setActiveNode = this.setActiveNode.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.autoScroll = this.autoScroll.bind(this);
        
        this.tap = this.tap.bind(this);
        this.drag = this.drag.bind(this);
        this.release = this.release.bind(this);
    }

    leftTracker() {
        var now, elapsed, delta;

        now = getTime();
        elapsed = now - this.timeStamp;
        this.timeStamp = now;
        delta = this.scrollLeft - this.lastScrollLeft;
        this.lastScrollLeft = this.scrollLeft;

        this.velocityLeft = 0.01 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityLeft;
    }

    topTracker() {
        var now, elapsed, delta;

        now = getTime();
        elapsed = now - this.timeStamp;
        this.timeStamp = now;
        delta = this.scrollTop - this.lastScrollTop;
        this.lastScrollTop = this.scrollTop;

        this.velocityTop = 0.2 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityTop;
    }

    autoScroll() {
        var elapsed;
        var deltaY = 0, deltaX = 0, scrollX = 0, scrollY = 0;
        var timeConstant = 325;

        elapsed = getTime() - this.timestamp;

        if ( this.amplitudeTop ) {
            deltaY = -this.amplitudeTop * Math.exp(-elapsed / timeConstant);
        }
        if ( this.amplitudeLeft ) {
            deltaX = -this.amplitudeLeft * Math.exp(-elapsed / timeConstant);
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

        if ( (deltaX > 0.5 || deltaX < -0.5) || (deltaY > 0.5 || deltaY < -0.5) ) {
            this.autoScrollTracker = requestAnimationFrame(this.autoScroll);
        } else {
            this.isAutoScrolling = false;
            this.autoScrollTracker = null;
        }
    }

    scrollTo(left, top) {
        let correctedLeft = Math.round(left);
        let correctedTop = Math.round(top);

        this.childNodes.forEach(node => {
            const $el = node.children[0];
            let maxScrollX = $el.scrollWidth - $el.clientWidth;
            let maxScrollY = $el.scrollHeight - $el.clientHeight;

            if ( maxScrollX > 0 && correctedLeft >= 0 && correctedLeft <= maxScrollX ) {
                $el.scrollLeft = correctedLeft;
                this.scrollLeft = correctedLeft;
            }
            if ( maxScrollY > 0 && correctedTop > 0 && correctedTop <= maxScrollY ) {
                $el.scrollTop = correctedTop;
                this.scrollTop = correctedTop;
            }
        })
    }

    setActiveNode(e) {
        this.activeId = findMatchingTarget(e.target, this.childNodes);
    }

    onScrollHandler(e) {
        if ( this.pressed || this.isAutoScrolling ) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        let target = e.target;
        let valX = undefined;
        let valY = undefined;

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

        this.childNodes.forEach(node => {
            if ( node.id !== this.activeId ) {
                node.children[0].scrollLeft = valX;
                node.children[0].scrollTop = valY;
            }
        });
    }

    tap(e) {
        this.pressed = true;
        this.referenceX = getPoint(e, this.hasTouch).x;
        this.referenceY = getPoint(e, this.hasTouch).y;

        this.velocityTop = this.amplitudeTop = 0;
        this.velocityLeft = this.amplitudeLeft = 0;

        this.lastScrollTop = this.scrollTop;
        this.lastScrollLeft = this.scrollLeft;

        this.timeStamp = getTime();

        if ( this.isAutoScrolling ) {
            cancelAnimationFrame(this.autoScrollTracker);
            this.isAutoScrolling = false;
            this.autoScrollTracker = null;
        }

        this.$listener.addEventListener( 'mousemove', this.drag, true );
        this.$listener.addEventListener( 'mouseup', this.release, true );

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    drag(e) {
        var x, y, deltaX, deltaY;

        if (this.pressed) {
            x = getPoint(e, this.hasTouch).x;
            y = getPoint(e, this.hasTouch).y;

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

            this.topTracker();
            this.leftTracker();

            this.scrollTo( this.scrollLeft + deltaX, this.scrollTop + deltaY );
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    release(e) {
        this.pressed = false;

        this.timestamp = getTime();

        if (this.velocityTop > 10 || this.velocityTop < -10) {
            this.amplitudeTop = 0.8 * this.velocityTop;
            this.targetTop = Math.round(this.scrollTop + this.amplitudeTop);
        }
        if (this.velocityLeft > 10 || this.velocityLeft < -10) {
            this.amplitudeLeft = 0.8 * this.velocityLeft;
            this.targetLeft = Math.round(this.scrollLeft + this.amplitudeLeft);
        }

        this.isAutoScrolling = true;
        this.autoScrollTracker = requestAnimationFrame(this.autoScroll);

        this.$listener.removeEventListener( 'mousemove', this.drag );
        this.$listener.removeEventListener( 'mouseup', this.release );

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    componentDidMount() {
        this.$listener.addEventListener( this.DETECT_EVT, this.setActiveNode, true );
        this.$listener.addEventListener( 'scroll', this.onScrollHandler, true );

        if ( ! this.hasTouch ) {
            this.$listener.addEventListener( 'mousedown', this.tap, true );
        }
    }

    componentWillUnmount() {
        this.$listener.removeEventListener( this.DETECT_EVT, this.setActiveNode );
        this.$listener.removeEventListener( 'scroll', this.onScrollHandler );

        if ( ! this.hasTouch ) {
            this.$listener.removeEventListener( 'mousedown', this.tap );
        }
    }

    render() {
        return (
            <span ref={
                $listener => {
                    this.$listener = $listener;
                }
            }>
                {
                    Children.map(this.props.children, (child, i) => {
                        let key = 'PARTICIPATING_NODE_' + i;
                        return (
                            <span key={key}
                                id={key}
                                ref={child => { this.childNodes[i] = child }}
                            >
                                {child}
                            </span>
                        )
                    })
                }
            </span>
        )
    }
}

SynchronousScrollSwipe.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

export default SynchronousScrollSwipe;
