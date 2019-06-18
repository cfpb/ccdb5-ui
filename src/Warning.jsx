import iconMap from './iconMap'
import React from 'react'

export const Warning = ( { text } ) =>
    <div className="m-notification
                    m-notification__visible
                    m-notification__warning">
        <span dangerouslySetInnerHTML={{__html: iconMap.getIcon( 'warning-round' ) }} />
        <div className="m-notification_content">
            <div className="h4 m-notification_message">{ text }</div>
        </div>
    </div>

export default Warning
