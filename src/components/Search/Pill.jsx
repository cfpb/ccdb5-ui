import './Pill.less'
import {
  dateRangeToggled,
  removeFilter,
  replaceFilters
} from '../../actions/filter'
import { filterPatch, SLUG_SEPARATOR } from '../../constants'
import { formatPillPrefix, getUpdatedFilters } from '../../utils/filters'
import { useDispatch, useSelector } from 'react-redux'
import { coalesce } from '../../utils'
import iconMap from '../iconMap'
import PropTypes from 'prop-types'
import React from 'react'
import { selectAggsState } from '../../reducers/aggs/selectors';
import { selectQueryState } from '../../reducers/query/selectors';

export const Pill = ( { fieldName, value } ) => {
  const aggsState = useSelector( selectAggsState )
  const queryState = useSelector( selectQueryState )
  const aggs = coalesce( aggsState, fieldName, [] )
  const filters = coalesce( queryState, fieldName, [] )
  const prefix = formatPillPrefix( fieldName );
  const trimmed = value.split( SLUG_SEPARATOR ).pop()
  const dispatch = useDispatch()

  const remove = () => {
    if ( fieldName === 'date_received' ) {
      // reset date range
      dispatch( dateRangeToggled( 'All' ) )
    } else {
      const filterName = value
      if ( filterPatch.includes( fieldName ) ) {
        const updatedFilters =
            getUpdatedFilters( filterName, filters, aggs, fieldName )
        dispatch( replaceFilters( fieldName, updatedFilters ) )
      } else {
        dispatch( removeFilter( fieldName, filterName ) )
      }
    }
  }

  return (
      <li className="pill flex-fixed">
        <span className="name">{ prefix }{ trimmed }</span>
        <button onClick={remove}>
          <span className="u-visually-hidden">
            { `Remove ${ trimmed } as a filter` }
          </span>
          { iconMap.getIcon( 'delete' ) }
        </button>
      </li>
  )
}

Pill.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}
