import React, { Component, Children, PropTypes } from 'react';
import {
    findMatchingTarget,
    getPoint,
    momentum
} from '../utils.js'

const ease = (k) => {
    return k * ( 2 - k );
}

const getTime = Date.now || function getTime () { return new Date().getTime(); };

class SynchronousScrollSwipe extends Component {
    constructor(props) {
        super(props);

        this.hasTouch = 'ontouchstart' in window;
        this.DETECT_EVT = this.hasTouch ? 'touchstart' : 'mouseover';
        this.START_EVT = this.hasTouch ? 'touchstart' : 'mousedown';
        this.MOVE_EVT  = this.hasTouch ? 'touchmove' : 'mousemove';
        this.END_EVT   = this.hasTouch ? 'touchend' : 'mouseup';

        this.$listener = undefined;
        this.childNodes = [];
        this.activeId = undefined;

        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.scrollHeight = 0;
        this.scrollWidth = 0;
        this.clientHeight = 0;
        this.clientWidth = 0;
        this.maxScrollX = 0;
        this.maxScrollY = 0;

        this.isTouching = false;
        this.didSwipe = false;

        this.isAnimating = false;
        this.loop = null;

        this.startTime = 0;
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;

        this.scrollTo = this.scrollTo.bind(this);
        this.setActiveNode = this.setActiveNode.bind(this);
        this.setScrollHeightWidth = this.setScrollHeightWidth.bind(this);

        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.animate = this.animate.bind(this);
    }

    scrollTo(valX, valY, forScroll) {
        let scrollX = valX || this.scrollLeft
        let scrollY = valY || this.scrollTop;

        this.childNodes.forEach(node => {
            if ( forScroll && node.id === this.activeId ) {
                // do nothing
            } else {
                node.children[0].scrollLeft = scrollX;
                node.children[0].scrollTop = scrollY;
            }
        });

        this.scrollLeft = scrollX;
        this.scrollTop = scrollY;
    }

    setScrollHeightWidth() {
        let scrollHeight = 0;
        let scrollWidth = 0;
        let clientHeight = 0;
        let clientWidth = 0;

        this.childNodes.forEach(node => {
            if ( node.children[0].scrollHeight > scrollHeight  ) {
                scrollHeight = node.children[0].scrollHeight;
            }
            if ( node.children[0].scrollWidth > scrollWidth  ) {
                scrollWidth = node.children[0].scrollWidth;
            }
            if ( node.children[0].clientHeight > clientHeight  ) {
                clientHeight = node.children[0].clientHeight;
            }
            if ( node.children[0].clientWidth > clientWidth  ) {
                clientWidth = node.children[0].clientWidth;
            }
        });

        this.scrollHeight = scrollHeight;
        this.scrollWidth = scrollWidth;
        this.clientHeight = clientHeight;
        this.clientWidth = clientWidth;

        this.maxScrollY = this.scrollHeight - this.clientHeight;
        this.maxScrollX = this.scrollWidth - this.clientWidth;
    }

    setActiveNode(e) {
        this.activeId = findMatchingTarget(e.target, this.childNodes);
    }

    onScrollHandler(e) {
        if ( this.isTouching || this.isAnimating ) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // the target may not have a particular scroll value or may be 0
        // and that will get applied to the other scroll area..
        let target = e.target;
        let valX = undefined;
        let valY = undefined;

        if ( target.clientWidth !== target.scrollWidth ) {
            valX = target.scrollLeft;
        }
        if ( target.clientHeight !== target.scrollHeight ) {
            valY = target.scrollTop;
        }

        this.scrollTo(valX, valY, true);
    }

    onTouchStart(e) {
        this.activeId = findMatchingTarget(e.target, this.childNodes);

        this.isTouching = true;
        this.didSwipe = false;
        this.startTime = getTime();

        let point = getPoint(e, this.hasTouch);
        this.startX = this.lastX = point.x;
        this.startY = this.lastY = point.y;

        this.$listener.removeEventListener( this.MOVE_EVT, this.onTouchMove );
        this.$listener.addEventListener( this.MOVE_EVT, this.onTouchMove, true );

        this.$listener.removeEventListener( this.END_EVT, this.onTouchEnd );
        this.$listener.addEventListener( this.END_EVT, this.onTouchEnd, true );
    }

    onTouchMove(e) {
        if ( ! this.isTouching ) {
            return;
        }

        this.didSwipe = true;
        e.preventDefault();

        let point = getPoint(e, this.hasTouch);
        let deltaX = point.x - this.lastX;
        let deltaY = point.y - this.lastY;

        deltaX = this.scrollLeft === 0 ? deltaX : this.scrollLeft + deltaX;
        deltaY = this.scrollTop === 0 ? deltaY : this.scrollTop + deltaY;
        this.scrollTo(deltaX, deltaY);

        this.lastY = point.y;
        this.lastX = point.x;
    }

    onTouchEnd(e) {
        if ( ! this.didSwipe ) {
            return;
        }

        e.preventDefault();

        let point = getPoint(e, this.hasTouch);
        let duration = getTime() - this.startTime;
        let time, momentumX, momentumY;

        if ( duration < 300 ) {
            momentumX = momentum(
                point.x,
                this.startX,
                duration,
                this.maxScrollX,
                this.clientWidth
            );
            momentumY = momentum(
                point.y,
                this.startY,
                duration,
                this.maxScrollY,
                this.clientHeight
            );

            time = Math.max(momentumX.duration, momentumY.duration);

            if ( momentumX.destination !== this.scrollLeft || momentumY.destination !== this.scrollTop ) {
                this.animate(this.startX, this.startY, momentumX.destination, momentumY.destination, time);
            }
        }

        /* clean up */
        this.isTouching = false;
        this.didSwipe = false;
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.$listener.removeEventListener( this.MOVE_EVT, this.onTouchMove );
        this.$listener.removeEventListener( this.END_EVT, this.onTouchEnd );
    }

    animate (startX, startY, destX, destY, duration) {
        let startTime = getTime(),
            destTime = startTime + duration;

        const step = () => {
            let now = getTime(),
                newX,
                newY,
                easing;

            if ( now >= destTime ) {
                this.isAnimating = false;
                this.scrollTo(destX, destY);
                return;
            }

            now = ( now - startTime ) / duration;
            easing = ease(now);
            newX = ( destX - startX ) * easing + startX;
            newY = ( destY - startY ) * easing + startY;
            this.scrollTo(newX, newY);

            if ( this.isAnimating ) {
                window.requestAnimationFrame(step);
            }
        }

        this.isAnimating = true;
        step();
    }

    componentDidMount() {
        this.$listener.addEventListener( this.DETECT_EVT, this.setActiveNode, true );
        this.$listener.addEventListener( 'scroll', this.onScrollHandler, true );

        if ( ! this.hasTouch ) {
            this.$listener.addEventListener( this.START_EVT, this.onTouchStart, true );
            this.setScrollHeightWidth();
        }
    }

    componentWillUnmount() {
        this.$listener.removeEventListener( this.DETECT_EVT, this.setActiveNode );
        this.$listener.removeEventListener( 'scroll', this.onScrollHandler );

        if ( ! this.hasTouch ) {
            this.$listener.removeEventListener( this.START_EVT, this.onTouchStart );
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

// SynchronousScrollSwipe.propTypes = {
//     children: PropTypes.element.isRequired
// }

export default SynchronousScrollSwipe;
