import React, { Component } from 'react';
import SynchronousScrollSwipe from '../hoc/SynchronousScrollSwipe';
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
            <SynchronousScrollSwipe>
                <List data={this.state.list} />
                <Table data={this.state.table} />
            </SynchronousScrollSwipe>
        );
    }
}

export default App;
