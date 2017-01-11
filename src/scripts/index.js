require('../scss/styles.scss');
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import App from './components/App';
import SynchronousScrollExample from './components/SynchronousScrollExample.js';
import SwipeToScrollExmple from './components/SwipeToScrollExample.js';

render(
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
        <Route path="/synchronous-scroll" component={SynchronousScrollExample}/>
        <Route path="/swipe-to-scroll" component={SwipeToScrollExmple}/>
    </Router>,
    document.getElementById('app')
);
