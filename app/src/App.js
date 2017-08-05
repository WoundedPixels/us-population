// @flow

import React, { Component } from 'react';
import Button from './components/Button/Button';
import logo from './logo.svg';
import './App.css';

function concat(a: string, b: string) {
  return a + b;
}

const together = concat('1', 'b');

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            Welcome to React {together}
          </h2>
          <Button>Yo yo</Button>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
