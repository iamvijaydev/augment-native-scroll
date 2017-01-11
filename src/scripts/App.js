import React, { Component } from 'react';
import SwipeToScroll from './SwipeToScroll';

class App extends Component {
    adder(limit) {

    }

    render() {
        let items = [];
        for( let i = 0; i < 100; i++ ) {
            items.push( Math.random().toString(10).substring(5) );
        }

        return (
            <SwipeToScroll>
                <ul className="block block--left">
                    {
                        items.map((item, i) => <li key={i}>Hello World</li>)
                    }
                </ul>
                <ul className="block block--right">
                    {
                        items.map((item, i) => <li key={i}>Hello World</li>)
                    }
                </ul>
            </SwipeToScroll>
        );
    }
}

export default App;
