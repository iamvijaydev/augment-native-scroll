import React, { Component } from 'react';
import SynchronousScrollSwipe from './SynchronousScrollSwipe';
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
            <SynchronousScrollSwipe options={{enableKinetic: this.state.enableKinetic}}>
                <List data={this.state.list} />
                <Table data={this.state.table} />
            </SynchronousScrollSwipe>
        );
    }
}

export default App;
