import React { Component } from 'react';

class SynchronusNativeScroll extends Component {
    constructor(props) {
        super(props);

        this.$listener = undefined;
        this.childNodes = [];
    }

    findTarget(target) {
        if ( target.tagName === 'BODY' ) {
            return 'BODY';
        }

        let found = this.childNodes.find(node => node.id === target.id);

        if ( found > -1 ) {
            return target.id;
        } else {
            return this.findTarget(target.offsetParent);
        }
    }

    onScrollHandler(e) {
        let id = e.target.id;
        let top = e.target.scrollTop;
        let left = e.target.scrollLeft;

        this.childNodes.map(node => {
            if ( node.id !== id ) {
                node.scrollTop = top;
                node.scrollLeft = left;
            }
        })
    }

    componentDidMount() {
        this.$listener.removeEventListener( 'scroll', this.onScrollHandler, true);
    }

    componentWillUnmount() {
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
                    this.props.children.map((child, i) => {
                        let key = 'PARTICIPATING_NODE_' + i;
                        return (
                            <span id={key}
                                ref={child => { this.childNodes[i] = child }}
                            >
                                {child}
                            <span>
                        )
                    })
                }
            </span>
        )
    }
}

SynchronusNativeScroll.propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SynchronusNativeScroll;
