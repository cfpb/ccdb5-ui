import './Pill.less'
import { changeDates, removeFilter, replaceFilters } from '../../actions/filter'
import { filterPatch, SLUG_SEPARATOR } from '../../constants'
import { formatPillPrefix, getUpdatedFilters } from '../../utils/filters'
import {
  selectQueryDateReceivedMax, selectQueryDateReceivedMin,
  selectQueryState
} from '../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux'
import { coalesce } from '../../utils'
import iconMap from '../iconMap'
import PropTypes from 'prop-types'
import React from 'react'
import { selectAggsState } from '../../reducers/aggs/selectors';

export const Pill = ( { fieldName, value } ) => {
  const aggsState = useSelector( selectAggsState )
  const queryState = useSelector( selectQueryState )
  const dateReceivedMax = useSelector( selectQueryDateReceivedMax )
  const dateReceivedMin = useSelector( selectQueryDateReceivedMin )
  const aggs = coalesce( aggsState, fieldName, [] )
  const filters = coalesce( queryState, fieldName, [] )
  const prefix = formatPillPrefix( fieldName );
  const trimmed = value.split( SLUG_SEPARATOR ).pop()
  const dispatch = useDispatch()

  /* eslint complexity: ["error", 6] */
  const remove = () => {
    if ( fieldName === 'date_received_max' ) {
      const minDate = dateReceivedMin ? dateReceivedMin : null;
      dispatch( changeDates( 'date_received', minDate, null ) )
    } else if ( fieldName === 'date_received_min' ) {
      const maxDate = dateReceivedMax ? dateReceivedMax : null;
      dispatch( changeDates( 'date_received', null, maxDate ) )
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
