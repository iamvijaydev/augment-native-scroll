import React, { Component } from 'react';
import { Link } from 'react-router'

class App extends Component {
    render() {
        return (
            <div className="container">
                <div className="header clearfix">
                    <nav>
                        <ul className="nav nav-pills pull-right">
                            <li role="presentation"><a href="https://github.com/iamvijaydev/augment-native-scroll">GitHub</a></li>
                            <li role="presentation"><a href="https://github.com/iamvijaydev/augment-native-scroll/issues">Issues</a></li>
                        </ul>
                    </nav>
                    <h3 className="text-muted">Augment Native Scroll</h3>
                </div>

                <div className="jumbotron">
                    <p className="lead">Primary objective is to have multiple (related) scrollable areas, scroll as one, when anyone of them is scrolled.</p>
                    <p className="lead">The demo is step up to test them on UIWebView (iOS) and determine the best way we can achieve the desired results.</p>
                </div>

                <div className="row marketing">
                    <h4>Synchronous Scroll Swipe <span className="mute"> - Augmenting default scroll and Mimic tap-swipe on non-touch devices</span></h4>
                    <p>This flavor detects touch support and provides synchronous scroll on both touch and no-touch devices. Additionally on non-touch devices it also provided swipe to scroll.</p>
                    <p><Link to='/synchronous-scroll-swipe' activeClassName='active'>Demo</Link></p>
                </div>

                <footer className="footer">
                    <p>Made with &hearts; by <a href="https://github.com/iamvijaydev">Vijay</a></p>
                </footer>
            </div>
        );
    }
}

export default App;
