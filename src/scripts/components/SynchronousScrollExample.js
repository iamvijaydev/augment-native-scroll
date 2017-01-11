import React, { Component } from 'react';
import SynchronousScroll from '../hoc/SynchronousScroll';
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
            <SynchronousScroll>
                <List data={this.state.list} />
                <Table data={this.state.table} />
            </SynchronousScroll>
        );
    }
}

export default App;
