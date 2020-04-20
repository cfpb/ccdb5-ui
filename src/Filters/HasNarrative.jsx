import { connect } from 'react-redux'
import { NARRATIVE_SEARCH_FIELD } from '../constants'
import PropTypes from 'prop-types'
import React from 'react'
import { toggleFlagFilter } from '../actions/filter'

const FIELD_NAME = 'has_narrative'

const SEARCHING = 'SEARCHING'
const FILTERING = 'FILTERING'
const NOTHING = 'NOTHING'

// ----------------------------------------------------------------------------
// The Class

export class HasNarrative extends React.Component {
  render() {
    return (
      <section className="single-checkbox">
        <h4>Only show complaints with narratives?</h4>
        <div className="m-form-field m-form-field__checkbox">
            <input className="a-checkbox"
                   checked={ this.props.phase !== NOTHING }
                   disabled={ this.props.phase === SEARCHING }
                   id="filterHasNarrative"
                   onChange={ () => this.props.toggleFlagFilter() }
                   type="checkbox"
                   value={ FIELD_NAME } />
            <label className="a-label" htmlFor="filterHasNarrative">Yes</label>
        </div>
      </section>
    )
  }
}

// ----------------------------------------------------------------------------
// Meta

HasNarrative.propTypes = {
  isChecked: PropTypes.bool
}

export const mapStateToProps = state => {
  const queryValue = state.query[FIELD_NAME] || ''
  const searchField = state.query.searchField

  const isChecked = queryValue.toString() === 'true'

  let phase = NOTHING
  if ( searchField === NARRATIVE_SEARCH_FIELD ) {
    phase = SEARCHING
  } else if ( isChecked ) {
    phase = FILTERING
  }

  return {
    isChecked,
    phase
  }
}

export const mapDispatchToProps = dispatch => ( {
  toggleFlagFilter: () => {
    dispatch( toggleFlagFilter( FIELD_NAME ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( HasNarrative )
