import React, { Component } from 'react';
import SwipeToScroll from '../hoc/SwipeToScroll';
import List from './List';
import Table from './Table';
import { generateData } from '../utils';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = generateData();
    }

    render() {
        return (
            <SwipeToScroll>
                <List data={this.state.list} />
                <Table data={this.state.table} />
            </SwipeToScroll>
        );
    }
}

export default App;
