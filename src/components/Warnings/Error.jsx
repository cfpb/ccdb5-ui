import iconMap from '../iconMap';
import React from 'react';

export const ErrorBlock = ( { text } ) => <div className="m-notification
                    m-notification__visible
                    m-notification__error">
  { iconMap.getIcon( 'error-round' ) }
  <div className="m-notification_content">
    <div className="h4 m-notification_message">{ text }</div>
  </div>
</div>;

export default ErrorBlock;
