import React, { Component, Children } from 'react';
import {
    findMatchingTarget,
    getPoint,
    computeSwipe,
    LEFT,
    RIGHT,
    UP,
    DOWN
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

        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.currX = 0;
        this.currY = 0;

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    onTouchStart(e) {
        this.$activeNode = findMatchingTarget(e.target, this.childNodes);

        this.isTouching = true;
        this.didSwipe = false;

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
        let point, swipe;
        const apply = (key, value) => {
            this.childNodes.forEach(node => {
                node.children[0][key] += value;

                scrollValue = node.children[0][key];

                correctedValue = scrollValue != 0 ? delta + scrollValue : delta;

                node.children[0][key] = correctedValue
            });
        }

        /**/

        if ( ! this.isTouching ) {
            return;
        }

        this.didSwipe = true;
        e.preventDefault();

        point = getPoint(e, this.hasTouch);
        swipe = computeSwipe({
            startX: this.lastX,
            curX: point.x,
            curY: point.y,
            startY: this.lastY
        });
        if ( swipe.deltaY > 45 ) {
            this.lastY = point.y
        }
        if ( swipe.deltaX > 45 ) {
            this.lastX = point.x
        }

        // if ( swipe.direction === UP || swipe.direction === DOWN ) {
        //     apply('scrollTop', swipe.deltaY);
        // } else if ( swipe.direction === LEFT || swipe.direction === RIGHT ) {
        //     apply('scrollLeft', swipe.deltaX);
        // }

        var deltaX = point.x - this.startX;
    }

    onTouchEnd(e) {
        if( ! this.didSwipe ) {
            return;
        };

        e.preventDefault();

        /* clean up */
        this.isTouching = false;
        this.didSwipe = false;
        this.startX = 0;
        this.startY = 0;
        this.currX = 0;
        this.currY = 0;
        this.$listener.removeEventListener( this.MOVE_EVT, this.onTouchMove );
        this.$listener.removeEventListener( this.END_EVT, this.onTouchEnd );
    };

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
