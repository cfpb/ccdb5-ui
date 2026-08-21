import './warning.scss';
import { Icon } from '@cfpb/design-system-react';
import PropTypes from 'prop-types';

export const Warning = ({ text, closeFn }) => (
  <div
    role="alert"
    className="warning-notification m-notification m-notification--visible m-notification--warning"
  >
    <Icon name="warning-round" isPresentational />
    <div className="m-notification__content">
      <div className="m-notification__message">{text}</div>
    </div>
    {closeFn ? (
      <button
        onClick={closeFn}
        onKeyDown={closeFn}
        aria-label="Dismiss"
        className="warning-notification__close"
      >
        <Icon name="error" isPresentational />
      </button>
    ) : (
      ''
    )}
  </div>
);

Warning.propTypes = {
  text: PropTypes.string.isRequired,
  closeFn: PropTypes.func,
};
