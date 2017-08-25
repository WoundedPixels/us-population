// @flow

import React, { Component } from 'react';
import './PeopleList.css';

class PeopleList extends Component {
  render() {
    const rows = [];
    this.props.people.forEach(person =>
      rows.push(
        <div key={person.name}>
          {person.name} {person.height}
        </div>,
      ),
    );

    return (
      <div className="PeopleList">
        {rows}
      </div>
    );
  }
}

export default PeopleList;
