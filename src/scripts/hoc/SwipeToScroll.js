import React, { Component, Children } from 'react';
import {
    findMatchingTarget,
    getPoint,
    computeSwipe,
    computeKinetics,
    easeOutQuint,
    LEFT,
    UP
} from '../utils.js'

class SynchronousScroll extends Component {
    constructor(props) {
        super(props);

        this.hasTouch = 'ontouchstart' in window;
        this.START_EVT = this.hasTouch ? 'touchstart' : 'mousedown';
        this.MOVE_EVT  = this.hasTouch ? 'touchmove' : 'mousemove';
        this.END_EVT   = this.hasTouch ? 'touchend' : 'mouseup';

        this.$listener = undefined;
        this.childNodes = [];
        this.$activeNode = undefined;

        this.currentXPos = 0;
        this.currentYPos = 0;

        this.isTouching = false;
        this.didSwipe = false;

        this.isAnimating = false;
        this.loop = null;

        this.startTime = 0;
        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.currX = 0;
        this.currY = 0;

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.doAnimation = this.doAnimation.bind(this);
    }

    onTouchStart(e) {
        this.$activeNode = findMatchingTarget(e.target, this.childNodes);

        this.isTouching = true;
        this.didSwipe = false;
        this.startTime = Date.parse(new Date());

        let point = getPoint(e, this.hasTouch);
        this.startX = this.lastX = point.x;
        this.startY = this.lastY = point.y;

        this.$listener.removeEventListener( this.MOVE_EVT, this.onTouchMove );
        this.$listener.addEventListener( this.MOVE_EVT, this.onTouchMove, true );

        this.$listener.removeEventListener( this.END_EVT, this.onTouchEnd );
        this.$listener.addEventListener( this.END_EVT, this.onTouchEnd, true );
    }

    onTouchMove(e) {
        let point, deltaY, deltaX;
        const apply = (key, delta) => {
            let corrected;

            if ( 'scrollLeft' === key ) {
                corrected = this.currentXPos !== 0 ? this.currentXPos + delta : delta;
            } else {
                corrected = this.currentYPos !== 0 ? this.currentYPos + delta : delta;
            }

            if ( corrected < 0 ) {
                return;
            }

            this.childNodes.forEach(node => {
                node.children[0][key] = corrected;
            });

            if ( 'scrollLeft' === key ) {
                this.currentXPos = corrected;
            } else {
                this.currentYPos = corrected;
            }
        }

        /**/

        // if animating due to momentum from previous swiping
        if ( this.isAnimating ) {
            window.cancelAnimationFrame(this.loop);
            this.loop = null;
        }

        if ( ! this.isTouching ) {
            return;
        }

        this.didSwipe = true;
        e.preventDefault();

        point = getPoint(e, this.hasTouch);
        deltaY = point.y - this.lastY;
        deltaX = point.x - this.lastX;

        apply('scrollTop', -deltaY);
        apply('scrollLeft', -deltaX);

        this.lastY = point.y;
        this.lastX = point.x;
    }

    onTouchEnd(e) {
        if ( ! this.didSwipe ) {
            return;
        }

        e.preventDefault();

        let point = getPoint(e, this.hasTouch);
        let swipe = computeSwipe({
            startX: this.startX,
            curX: point.x,
            startY: this.startY,
            curY: point.y
        });

        let diff, from;
        if ( swipe.direction === LEFT || swipe.direction === UP ) {
            diff = swipe.diffX;
            from = this.currentXPos;
        } else {
            diff = swipe.diffY;
            from = this.currentYPos;
        }

        let kinetics = computeKinetics(
            from,
            swipe.direction,
            diff,
            Date.parse( new Date() ) - this.startTime
        );
        this.doAnimation(
            swipe.direction,
            kinetics.from,
            kinetics.to,
            kinetics.duration
        )

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

    doAnimation(direction, from, to, duration) {
        let diff = to - from;
        let scrollKey;

        let start, progress, delta;
        const animate = (timestamp) => {
            if ( ! start ) {
                start = timestamp;
            }

            progress = timestamp - start;
            delta = easeOutQuint(progress, from, diff, duration);

            if ( direction === LEFT || direction === UP ) {
                scrollKey = 'scrollLeft';
                this.currentXPos = delta;
            } else {
                scrollKey = 'scrollTop';
                this.currentYPos = delta;
            }
            this.childNodes.forEach(node => {
                node.children[0][scrollKey] = delta;
            });

            if ( duration > progress ) {
                if ( this.loop === null ) {
                    this.loop = window.requestAnimationFrame(animate);
                } else {
                    window.requestAnimationFrame(animate);
                }
                this.isAnimating = true;
            } else {
                this.isAnimating = false;
            }
        }

        window.requestAnimationFrame(animate);
    }

    componentDidMount() {
        this.$listener.addEventListener( this.START_EVT, this.onTouchStart, true );
        this.v = document.getElementById('v');
    }

    componentWillUnmount() {
        this.$listener.removeEventListener( this.START_EVT, this.onTouchStart );
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

export default SynchronousScroll;
