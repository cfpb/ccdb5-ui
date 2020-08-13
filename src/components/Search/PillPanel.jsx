import './PillPanel.less'
import { coalesce } from '../../utils'
import { connect } from 'react-redux'
import iconMap from '../iconMap'
import { knownFilters } from '../../constants'
import Pill from './Pill'
import React from 'react'
import { removeAllFilters } from '../../actions/filter'


export const PillPanel = ( { filters, clearAll } ) => {
  const hasFilters = filters && filters.length > 0
  if ( !hasFilters ) {
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
          <button className="a-btn a-btn__link body-copy" onClick={ clearAll }>
            { iconMap.getIcon( 'delete' ) }
            Clear all filters
          </button>
        </li>
      </ul>
    </section>
  )
}

export const mapStateToProps = state => {
  const query = coalesce( state, 'query', {} )
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
      value: 'Has Narrative'
    } )
  }

  return {
    filters: filters
  }
}

export const mapDispatchToProps = dispatch => ( {
  clearAll: () => {
    dispatch( removeAllFilters() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( PillPanel )
