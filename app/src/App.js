// @flow

import React, { Component } from 'react';
import PeopleList from './components/PeopleList/PeopleList';
import PersonForm from './components/PersonForm/PersonForm';

import './App.css';

class App extends Component {
  state: {
    people: { name: string, height: number }[],
  };

  onAddPerson: Function;

  constructor(props: Object) {
    super(props);

    this.state = {
      people: [],
    };

    this.onAddPerson = this.onAddPerson.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        people: [{ name: 'wilma', height: 68 }],
      });
    }, 2000);
  }

  onAddPerson(person: Object) {
    console.log('added person', person);
    this.setState({ people: this.state.people.concat(person) });
  }

  render() {
    return (
      <div className="App">
        <PersonForm onAdd={this.onAddPerson} />
        <PeopleList people={this.state.people} />
      </div>
    );
  }
}

export default App;
