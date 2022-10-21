import './Loading.less';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export const Loading = ({ isLoading }) => {
  return isLoading ? (
    <section className="light-box">
      <div className="loading-box">
        {iconMap.getIcon('updating')} <span>This page is loading</span>
      </div>
    </section>
  ) : null;
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
