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
                    <p className="lead">The demos are step up to test them on UIWebView (iOS) and determine the best way we can achieve the desired results.</p>
                    <p className="lead">There are three different implemented flavors of native scrolls listed below.</p>
                </div>

                <div className="row marketing">
                    <h4>Synchronous Scroll <span className="mute">(Augmenting default scroll)</span></h4>
                    <p>This flavor wraps the native scroll to have multiple scrollable areas scroll as one. Works on both touch and non-touch devices.</p>
                    <p><Link to='/synchronous-scroll' activeClassName='active'>Demo</Link></p>

                    <h4>Swipe to Scroll <span className="mute">(Mimic tap-swipe on non-touch devices)</span></h4>
                    <p>This flavor wraps the native scroll and disables default scroll behavior to provide tap and swipe like feature for non-touch devices. Only works on non-touch devices.</p>
                    <p><Link to='/swipe-to-scroll' activeClassName='active'>Demo</Link></p>

                    <h4>Synchronous Scroll Swipe <span className="mute">(Both flavors working together)</span></h4>
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
