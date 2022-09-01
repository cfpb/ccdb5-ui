import './Loading.less';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export default class Loading extends React.Component {
  render() {
    return this.props.isLoading ?
      <section className='light-box'>
        <div className='loading-box'>
          { iconMap.getIcon( 'updating' ) }
          <span>This page is loading</span>
        </div>
      </section> :
      null;
  }
}

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

Loading.defaultProps = {
};
