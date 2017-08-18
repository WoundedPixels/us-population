// @flow

import React, { Component } from 'react';
import Person from '../../model/Person';

import './PersonForm.css';

class PersonForm extends Component {
  state: Person;

  handleSubmit: Function;
  handleInputChange: Function;

  constructor(props: Object) {
    super(props);

    this.state = new Person('', 0);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event: Object) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const converted = target.name === 'height' ? parseInt(value, 10) : value;

    this.setState({
      [name]: converted,
    });
  }

  handleSubmit(event: Object) {
    this.props.onAdd(new Person(this.state.name, this.state.height));
    event.preventDefault();
  }

  render() {
    return (
      <div className="PersonForm">
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:<input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            Height:<input
              type="text"
              name="height"
              value={this.state.height}
              onChange={this.handleInputChange}
            />
          </label>
          <input type="submit" value="Add" />
        </form>
      </div>
    );
  }
}

export default PersonForm;
