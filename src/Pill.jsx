import React from 'react';
//import { connect } from 'react-redux';
import './Pill.less';

export const Pill = ({fieldName, value}) => {
  return (
    <li className="pill flex-fixed">
      <span className="name">{ value }</span>
      <button onClick={ (0) } 
              title={'Remove ' + value + ' as a filter'}>
          <span className="cf-icon cf-icon-delete"></span>
      </button>
    </li>
  );
}

export default Pill;