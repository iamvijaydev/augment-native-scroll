import React, { Component, Children } from 'react';
import { findMatchingTarget } from '../utils.js'

class SynchronousScroll extends Component {
    constructor(props) {
        super(props);

        const hasTouch = 'ontouchstart' in window;
        this.detectEvt = hasTouch ? 'touchstart' : 'mouseover';

        this.$listener = undefined;
        this.childNodes = [];
        this.$activeNode = undefined;

        this.setActiveNode = this.setActiveNode.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
    }

    setActiveNode(e) {
        this.$activeNode = findMatchingTarget(e.target, this.childNodes);
    }

    onScrollHandler(e) {
        let top = e.target.scrollTop;
        let left = e.target.scrollLeft;

        this.childNodes.forEach(node => {
            if ( node.id !== this.$activeNode ) {
                node.children[0].scrollTop = top;
                node.children[0].scrollLeft = left;
            }
        })
    }

    componentDidMount() {
        this.$listener.addEventListener( this.detectEvt, this.setActiveNode, true );
        this.$listener.addEventListener( 'scroll', this.onScrollHandler, true );
    }

    componentWillUnmount() {
        this.$listener.removeEventListener( this.detectEvt, this.setActiveNode );
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

export default SynchronousScroll;
