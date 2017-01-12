import React, { Component, Children } from 'react';
import {
    findMatchingTarget,
    getPoint,
    computeSwipe,
    computeKinetics,
    easeOutQuint,
    LEFT,
    RIGHT,
} from '../utils.js'

class SynchronousScrollSwipe extends Component {
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

        this.setActiveNode = this.setActiveNode.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.doAnimation = this.doAnimation.bind(this);
    }

    setActiveNode(e) {
        this.$activeNode = findMatchingTarget(e.target, this.childNodes);
    }

    onScrollHandler(e) {
        let top = e.target.scrollTop;
        let left = e.target.scrollLeft;

        // ignore while the other way of scrolling is in control
        if ( this.isTouching || this.isAnimating ) {
            e.preventDefault();
            return;
        }

        this.childNodes.forEach(node => {
            if ( node.id !== this.$activeNode ) {
                node.children[0].scrollTop = top;
                node.children[0].scrollLeft = left;
            }
        })

        this.currentXPos = left;
        this.currentYPos = top;
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

        if ( ! this.isTouching ) {
            return;
        }

        this.didSwipe = true;
        e.preventDefault();

        if ( this.isAnimating ) {
            window.cancelAnimationFrame(this.loop);
            this.loop = null;
            this.isAnimating = false;
        }

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
        if ( swipe.direction === LEFT || swipe.direction === RIGHT ) {
            diff = Math.abs(point.x - this.startX);
            from = this.currentXPos;
        } else {
            diff = Math.abs(point.y - this.startY);
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
        let start, progress, delta;

        var nodes = this.childNodes;
        var scrollKey, key;

        if ( direction === LEFT || direction === RIGHT ) {
            scrollKey = 'scrollLeft';
            key = 'currentXPos'
        } else {
            scrollKey = 'scrollTop';
            key = 'currentYPos'
        }

        var step = (timestamp) => {
            if ( ! start ) {
                start = timestamp;
            }

            progress = timestamp - start;
            delta = easeOutQuint(progress, from, diff, duration);

            if ( delta > 0 ) {
                nodes.forEach(node => {
                    node.children[0][scrollKey] = delta;
                });
                this[key] = delta;

                if ( duration > progress ) {
                    this.loop = window.requestAnimationFrame(step);
                    this.isAnimating = true;
                } else {
                    this.isAnimating = false;
                }
            } else {
                this.isAnimating = false;
            }
        }

        window.requestAnimationFrame(step);
    }

    componentDidMount() {
        this.$listener.addEventListener( this.START_EVT, this.onTouchStart, true );

        if ( ! this.hasTouch ) {
            this.$listener.addEventListener( 'mouseover', this.setActiveNode, true );
        }
        this.$listener.addEventListener( 'scroll', this.onScrollHandler, true );
    }

    componentWillUnmount() {
        this.$listener.removeEventListener( this.START_EVT, this.onTouchStart );

        if ( ! this.hasTouch ) {
            this.$listener.removeEventListener( 'mouseover', this.setActiveNode );
        }
        this.$listener.removeEventListener( 'scroll', this.onScrollHandler );
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

export default SynchronousScrollSwipe;
