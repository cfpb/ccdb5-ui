import './Warning.scss';
import { Button } from '@cfpb/design-system-react';
import getIcon from '../Common/Icon/iconMap';
import PropTypes from 'prop-types';

export const Warning = ({ text, closeFn }) => (
  <div
    role="alert"
    className="warning m-notification m-notification--visible m-notification--warning"
  >
    {getIcon('warning-round')}
    <div className="m-notification__content">
      <div className="m-notification__message">{text}</div>
    </div>
    {closeFn ? (
      <Button
        label=""
        iconLeft="delete"
        aria-label="Dismiss"
        className="close"
        onClick={closeFn}
        onKeyDown={closeFn}
      />
    ) : (
      ''
    )}
  </div>
);

Warning.propTypes = {
  text: PropTypes.string.isRequired,
  closeFn: PropTypes.func,
};
