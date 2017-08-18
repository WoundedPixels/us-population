import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import superagent from 'superagent';
import App from './App';

it('renders without crashing', () => {
  sinon.stub(superagent, 'get').resolves([{ name: 'red', height: 55 }]);
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
