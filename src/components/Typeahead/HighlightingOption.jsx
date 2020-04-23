import PropTypes from 'prop-types'
import React from 'react'

export const HighlightingOption = ( { label, position, value } ) => {
  if ( position < 0 ) {
    return <span>{label}</span>
  }

  const start = label.substring( 0, position )
  const match = label.substr( position, value.length )
  const end = label.substring( position + value.length )

  return (
      <span>{start}<b>{match}</b>{end}</span>
  )
}

HighlightingOption.propTypes = {
  label: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired
}

export default HighlightingOption
