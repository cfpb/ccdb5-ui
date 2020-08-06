import './Pill.less'
import { connect } from 'react-redux'
import iconMap from '../iconMap'
import PropTypes from 'prop-types'
import React from 'react'
import { removeFilter } from '../../actions/filter'
import { SLUG_SEPARATOR } from '../../constants'

export class Pill extends React.Component {
  render() {
    const { value, remove } = this.props
    const parts = value.split( SLUG_SEPARATOR )
    const trimmed = parts.length > 1 ? parts.pop() : parts[0]
    return (
      <li className="pill flex-fixed">
        <span className="name">{ trimmed }</span>
        <button onClick={ remove }>
          <span className="u-visually-hidden">
            { `Remove ${ trimmed } as a filter` }
          </span>
          { iconMap.getIcon( 'delete' ) }
        </button>
      </li>
    )
  }
}

export const mapDispatchToProps = ( dispatch, props ) => ( {
  remove: () => { dispatch( removeFilter( props.fieldName, props.value ) ) }
} )

export default connect( null, mapDispatchToProps )( Pill );

Pill.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}
