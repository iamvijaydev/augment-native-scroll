import React, { Component, Children, PropTypes } from 'react';
import KineticEngine from './KineticEngine.js'

class ConnectScrolls extends Component {
    constructor(props) {
        super(props);

        this.kinetics = undefined;
        this.$listener = undefined;
        this.childNodes = [];
    }

    componentDidMount() {
        this.kinetics = new KineticEngine({
            $listener: this.$listener,
            childNodes: this.childNodes
        });
        this.kinetics.init({
            enableKinetics: true,
            movingAverage: 0.2
        })
    }

    componentWillUnmount() {
        this.kinetics.destroy();
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

ConnectScrolls.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

export default ConnectScrolls;
