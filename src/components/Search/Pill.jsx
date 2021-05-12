import './Pill.less'
import { filterPatch, SLUG_SEPARATOR } from '../../constants'
import { formatPillPrefix, getUpdatedFilters } from '../../utils/filters'
import { removeFilter, replaceFilters } from '../../actions/filter'
import { coalesce } from '../../utils'
import { connect } from 'react-redux'
import iconMap from '../iconMap'
import PropTypes from 'prop-types'
import React from 'react'

export class Pill extends React.Component {
  render() {
    const { fieldName, value, remove } = this.props
    const prefix = formatPillPrefix( fieldName );
    const trimmed = value.split( SLUG_SEPARATOR ).pop()
    return (
      <li className="pill flex-fixed">
        <span className="name">{ prefix }{ trimmed }</span>
        <button onClick={ () => remove( this.props ) }>
          <span className="u-visually-hidden">
            { `Remove ${ trimmed } as a filter` }
          </span>
          { iconMap.getIcon( 'delete' ) }
        </button>
      </li>
    )
  }
}
export const mapStateToProps = ( state, ownProps ) => {
  const aggs = coalesce( state.aggs, ownProps.fieldName, [] )
  const filters = coalesce( state.query, ownProps.fieldName, [] )
  return {
    aggs,
    filters
  }
}

export const mapDispatchToProps = ( dispatch, ownProps ) => ( {
  remove: props => {
    const filterName = props.value
    const { fieldName } = ownProps
    if ( filterPatch.includes( fieldName ) ) {
      const updatedFilters = getUpdatedFilters( filterName, props.filters,
        props.aggs, fieldName )
      dispatch( replaceFilters( fieldName, updatedFilters ) )
    } else {
      dispatch( removeFilter( fieldName, filterName ) )
    }
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( Pill );

Pill.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}
