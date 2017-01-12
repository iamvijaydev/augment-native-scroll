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
                    <p className="lead">The aim of this project is to experiment with custom wrappers over native scroll to achieve higher functionality.</p>
                    <p className="lead">The prime feature is about synchronous scroll, where multiple scrollable areas, scroll as one when anyone of them is scrolled.</p>
                    <p className="lead">The demos are step to test them on UIWebView (iOS) and determine the best way we can achieve the desired result.</p>
                </div>

                <div className="row marketing">
                    <h4>Synchronous Scroll</h4>
                    <p>Related scrollable areas scroll as one when anyone of them is scrolled via mouse or keyboard. This is primarily focused for non-touch devices</p>
                    <p><Link to='/synchronous-scroll' activeClassName='active'>Demo</Link></p>

                    <h4>Swipe to Scroll</h4>
                    <p>Related scrollable areas can be scrolled via swipe or on non-touch devices mimicking the same via mouse. This is primarily focused for bring touch like features to non-touch devices</p>
                    <p><Link to='/swipe-to-scroll' activeClassName='active'>Demo</Link></p>

                    <h4>Both</h4>
                    <p>Both the scrolling feature working together smoothly</p>
                    <p><a href="">TBD</a></p>
                </div>

                <footer className="footer">
                    <p>Made with &hearts; by <a href="https://github.com/iamvijaydev">Vijay</a></p>
                </footer>
            </div>
        );
    }
}

export default App;
