require('../scss/styles.scss');
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import App from './components/App';
import SynchronousScrollSwipeExample from './components/SynchronousScrollSwipeExample.js';

render(
    /** only 'hashHistory' will work well with gh-pages */
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/synchronous-scroll-swipe" component={SynchronousScrollSwipeExample}/>
    </Router>,
    document.getElementById('app')
);
