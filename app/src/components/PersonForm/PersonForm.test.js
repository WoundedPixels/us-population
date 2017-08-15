import React from 'react';
import ReactDOM from 'react-dom';
import PersonForm from './PersonForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PersonForm />, div);
});
