import './PillPanel.less';
import { connect } from 'react-redux'
import { knownFilters } from './constants'
import Pill from './Pill';
import React from 'react';
import { removeAllFilters } from './actions/filter'

export const PillPanel = ( { filters, clearAll } ) => {
  if ( !filters || filters.length === 0 ) {
    return null
  }

  return (
    <section className="pill-panel">
      <h4 className="pill-label flex-fixed">Filters Applied:</h4>
      <ul className="layout-row">
        { filters.map( x => <Pill key={x.fieldName + x.value}
                                 fieldName={x.fieldName}
                                 value={x.value} /> )
        }
        <li className="clear-all">
          <button className="a-btn a-btn__link body-copy" onClick={ clearAll }>
            Clear all filters
          </button>
        </li>
      </ul>
    </section>
  );
}

export const mapStateToProps = state => {
  const subState = state.query
  const filters = knownFilters
    // Only use the known filters that are in the substate
    .filter( x => x in subState )
    // Create a flattened array of pill objects
    .reduce( ( accum, fieldName ) => {
      const arr = subState[fieldName].map(
        value => ( { fieldName, value } )
      )
      return accum.concat( arr )
    }, [] )

  return {
    filters: filters
  }
}

export const mapDispatchToProps = dispatch => ( {
  clearAll: () => { dispatch( removeAllFilters() ) }
} )

export default connect( mapStateToProps, mapDispatchToProps )( PillPanel );
