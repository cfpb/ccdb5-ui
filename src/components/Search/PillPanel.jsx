import './PillPanel.less'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs';
import iconMap from '../iconMap'
import { knownFilters } from '../../constants'
import { Pill } from './Pill'
import React from 'react'
import { removeAllFilters } from '../../actions/filter'
import { selectQueryState } from '../../reducers/query/selectors';

/* eslint complexity: ["error", 5] */
export const PillPanel = () => {
  const dispatch = useDispatch()
  const query = useSelector( selectQueryState );
  const filters = knownFilters
      // Only use the known filters that are in the query
      .filter( x => x in query )
      // Create a flattened array of pill objects
      .reduce( ( accum, fieldName ) => {
        const arr = query[fieldName].map(
            value => ( { fieldName, value } )
        )
        return accum.concat( arr )
      }, [] )

  // Add Has Narrative, if it exists
  if ( query.has_narrative ) {
    filters.push( {
      fieldName: 'has_narrative',
      value: 'Has narrative'
    } )
  }

  if ( query.date_received_min ) {
    // add DateFilters
    filters.push( {
      fieldName: 'date_received_min',
      value: 'Date From: ' +
          dayjs( query.date_received_min ).format( 'M/D/YYYY' )
    } )
  }

  if ( query.date_received_max ) {
    // add DateFilters
    filters.push( {
      fieldName: 'date_received_max',
      value: 'Date Through: ' +
          dayjs( query.date_received_max ).format( 'M/D/YYYY' )
    } )
  }

  if ( !filters.length ) {
    return null
  }

  return (
    <section className="pill-panel">
      <h3 className="h4 pill-label flex-fixed">Filters applied:</h3>
      <ul className="layout-row">
        { filters.map( x => <Pill key={ x.fieldName + x.value }
                                  fieldName={ x.fieldName }
                                  value={ x.value }/> )
        }
        <li className="clear-all">
          <button className="a-btn a-btn__link body-copy"
                  onClick={ () => dispatch( removeAllFilters() ) }>
            { iconMap.getIcon( 'delete' ) }
            Clear all filters
          </button>
        </li>
      </ul>
    </section>
  )
}
