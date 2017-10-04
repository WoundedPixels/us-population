import React from 'react';

import './Tips.css';

function Tips(props) {
  return (
    <div className="Tips">
      {props.children}
    </div>
  );
}

export default Tips;
