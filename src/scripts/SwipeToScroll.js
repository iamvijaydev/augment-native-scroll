import React, { Component, Children } from 'react';
import {
    findMatchingTarget,
    getPoint,
    computeSwipe,
    computeKinetics,
    callRaf,
    cancelRaf,
    easeOutQuint,
    LEFT,
    UP
} from './utils.js'

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

        this.$listener.addEventListener(
            this.MOVE_EVT,
            this.onTouchMove,
            true
        );
        this.$listener.addEventListener(
            this.END_EVT,
            this.onTouchEnd,
            true
        );
    }

    onTouchMove(e) {
        let point, deltaY, deltaX;
        const apply = (key, delta) => {
            let corrected;

            if ( 'scrollLeft' === key ) {
                corrected = this.currentXPos !== 0 ? delta + this.currentXPos : delta;
            } else {
                corrected = this.currentYPos !== 0 ? delta + this.currentYPos : delta;
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
        if( this.isAnimating ) {
            cancelRaf(this.loop);
        }

        if ( ! this.isTouching ) {
            return;
        }

        this.didSwipe = true;
        e.preventDefault();

        point = getPoint(e, this.hasTouch);
        deltaY = point.y - this.lastY;
        deltaX = point.x - this.lastX;

        apply('scrollTop', deltaY);
        apply('scrollLeft', deltaX);

        this.lastY = point.y;
        this.lastX = point.x;
    }

    onTouchEnd(e) {
        if( ! this.didSwipe ) {
            return;
        };

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

        // TODO: Need to fix calcuation errors
        // let kinetics = computeKinetics(
        //     from,
        //     swipe.direction,
        //     diff,
        //     Date.parse( new Date() ) - this.touchStartTime
        // );
        // this.doAnimation(
        //     swipe.direction,
        //     kinetics.from,
        //     kinetics.to,
        //     kinetics.duration
        // )

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
        let delta = 0;
        let diff = to - from;
        let currentTime = 0;
        let scrollKey;

        const animate = () => {
            delta = easeOutQuint(currentTime, from, diff, duration);

            if ( direction === LEFT || direction === UP ) {
                scrollKey = 'scrollLeft';
                //this.currentXPos = delta;
            } else {
                scrollKey = 'scrollTop';
                //this.currentYPos = delta;
            }
            this.childNodes.forEach(node => {
                node.children[0][scrollKey] = delta;
            });

            if(duration > currentTime) {
                this.loop = callRaf(animate);
                this.isAnimating = true;
            } else {
                cancelRaf(this.loop);
                this.isAnimating = false;
            }

            currentTime += 20;
        };

        animate();
    }

    componentDidMount() {
        this.$listener.addEventListener( this.START_EVT, this.onTouchStart, true );
    }

    componentWillUnmount() {
        this.$listener.removeEventListener( this.START_EVT, this.onTouchStart );
    }
    componentWillReceiveProps(nextProp){

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
