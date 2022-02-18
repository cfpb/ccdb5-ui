import { addFilter, removeFilter } from '../../actions/filter'
import { coalesce } from '../../utils'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const FIELD_NAME = 'has_narrative'

export class NarrativesButtons extends React.Component {

  _handleAddNarrative() {
    if ( !this.props.isChecked ) {
      this.props.addNarrativeFilter()
    }
  }

  _handleRemoveNarrative() {
    if ( this.props.isChecked ) {
      this.props.removeNarrativeFilter()
    }
  }

  render() {
    const { isChecked } = this.props;
    return (
      <section className="m-btn-group">
        <p>Read</p>
        <button
          id="refineToggleNarrativesButton"
          className={ `a-btn toggle-button ${
            isChecked ? 'selected' : 'deselected' }` }
          onClick={ () => this._handleAddNarrative() }>
            Only complaints with narratives
        </button>
        <button
          id="refineToggleNoNarrativesButton"
          className={ `a-btn toggle-button ${
            isChecked ? 'deselected' : 'selected' }` }
          onClick={ () => this._handleRemoveNarrative() }>
          All complaints
        </button>
      </section>
    )
  }
}

// ----------------------------------------------------------------------------
// Meta

NarrativesButtons.propTypes = {
  isChecked: PropTypes.bool
}

export const mapStateToProps = state => {
  const isChecked = coalesce( state.query, FIELD_NAME, false );

  return {
    isChecked
  }
}

export const mapDispatchToProps = dispatch => ( {
  addNarrativeFilter: () => {
    dispatch( addFilter( FIELD_NAME ) )
  },
  removeNarrativeFilter: () => {
    dispatch( removeFilter( FIELD_NAME ) )
  }
} )

export default connect(
  mapStateToProps, mapDispatchToProps )( NarrativesButtons )
