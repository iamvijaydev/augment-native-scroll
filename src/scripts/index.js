require("../scss/styles.scss");
import React from 'react';
import {render} from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import App from './App';

render(
    <App />,
    document.getElementById('app')
);


require("../scss/style.scss");
import React from 'react';
import {render} from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import Landing from './Landing';
import Report from './report/Report';

render(
    <Router history={browserHistory}>
        <Route path="/" component={Landing}/>
        <Route path="/report" component={Report}/>
    </Router>,
    document.getElementById('app')
);
