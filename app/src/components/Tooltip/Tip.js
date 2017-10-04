import React from 'react';

function Tip(props) {
  return (
    <div className="Tip">
      <span className="label">
        {props.label}
      </span>
      <span className="value">
        {props.value}
      </span>
    </div>
  );
}

export default Tip;
