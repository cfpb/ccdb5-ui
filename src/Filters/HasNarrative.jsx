import { changeFlagFilter } from '../actions/filter'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const FIELD_NAME = 'has_narrative'
const NARRATIVE_SEARCH_FIELD = 'complaint_what_happened'

const SEARCHING = 'SEARCHING'
const FILTERING = 'FILTERING'
const NOTHING = 'NOTHING'

// ----------------------------------------------------------------------------
// The Class

export class HasNarrative extends React.Component {
  constructor( props ) {
    super( props )
    this.state = { isChecked: this.props.isChecked }
  }

  componentWillReceiveProps( nextProps ) {
    const newState = {
      isChecked: nextProps.isChecked
    }
    this.setState( newState )
  }

  componentDidUpdate( _, prevState ) {
    if ( prevState.isChecked !== this.state.isChecked ) {
      this.props.changeFlagFilter( FIELD_NAME, this.state.isChecked )
    }
  }

  render() {
    return (
      <section className="single-checkbox">
        <h4>Only show complaints with narratives?</h4>
        <div className="m-form-field m-form-field__checkbox">
            <input className="a-checkbox"
                   checked={ this.props.phase !== NOTHING }
                   disabled={ this.props.phase === SEARCHING }
                   id="theCheckbox"
                   onClick={ this._changeFlag.bind( this ) }
                   type="checkbox"
                   value={ FIELD_NAME } />
            <label className="a-label" htmlFor="theCheckbox">Yes</label>
        </div>
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Helper Methods

  _changeFlag( ) {
    const newState = {
      isChecked: !this.state.isChecked
    }
    this.setState( newState )
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
  changeFlagFilter: ( fieldName, isChecked ) => {
    dispatch( changeFlagFilter( fieldName, isChecked ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( HasNarrative )
