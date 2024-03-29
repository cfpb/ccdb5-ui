import getIcon from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export const ErrorBlock = ({ text }) => (
  <div
    role="alert"
    className="m-notification m-notification__visible m-notification__error"
  >
    {getIcon('error-round')}
    <div className="m-notification_content">
      <div className="h4 m-notification_message">{text}</div>
    </div>
  </div>
);

export default ErrorBlock;

ErrorBlock.propTypes = {
  text: PropTypes.string.isRequired,
};
