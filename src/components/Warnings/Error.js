import { Icon } from '@cfpb/design-system-react';
import PropTypes from 'prop-types';
import './Error.scss';

export const ErrorBlock = ({ text }) => (
  <div
    role="alert"
    className="error m-notification m-notification--visible m-notification--error"
  >
    <Icon name="error-round" isPresentational />
    <div className="m-notification__content">
      <div className="m-notification__message">{text}</div>
    </div>
  </div>
);

ErrorBlock.propTypes = {
  text: PropTypes.string.isRequired,
};
