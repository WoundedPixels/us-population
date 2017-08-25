// @flow

import React, { Component } from 'react';
import request from 'superagent';

import Person from './model/Person';
import PeopleList from './components/PeopleList/PeopleList';
import PersonForm from './components/PersonForm/PersonForm';

import './App.css';

class App extends Component {
  state: {
    people: Person[],
  };

  addPerson: Function;

  constructor(props: Object) {
    super(props);

    this.state = {
      people: [],
    };

    this.addPerson = this.addPerson.bind(this);
  }

  componentDidMount() {
    request.get('/data/people.json').then(result => {
      if (result && result.body && Array.isArray(result.body)) {
        result.body.forEach(person => {
          this.addPerson(person);
        });
      }
    });
  }

  addPerson(person: Person) {
    this.setState({ people: this.state.people.concat(person) });
  }

  render() {
    return (
      <div className="App">
        <PersonForm onAdd={this.addPerson} />
        <PeopleList people={this.state.people} />
      </div>
    );
  }
}

export default App;
