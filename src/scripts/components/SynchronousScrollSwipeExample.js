import React, { Component } from 'react';
import ConnectScrolls from './ConnectScrolls';
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
            <ConnectScrolls>
                <List data={this.state.list} />
                <Table data={this.state.table} />
            </ConnectScrolls>
        );
    }
}

export default App;
