import { coalesce } from '../../utils'
import { connect } from 'react-redux'
import { NARRATIVE_SEARCH_FIELD } from '../../constants'
import PropTypes from 'prop-types'
import React from 'react'
import { toggleFlagFilter } from '../../actions/filter'

const FIELD_NAME = 'has_narrative'

const SEARCHING = 'SEARCHING'
const FILTERING = 'FILTERING'
const NOTHING = 'NOTHING'

export class NarrativesButtons extends React.Component {
  _getNarrativesButtonClass() {
    return this.props.options.phase === NOTHING ? 'deselected' : 'selected'
  }

  _getAllComplaintsButtonClass() {
    return this.props.options.phase === NOTHING ? 'selected' : 'deselected'
  }

  render() {
    const { toggleFlag } = this.props;
    return (
      <section className="m-btn-group">
        <p>Read</p>
        <button
          id="refineToggleNarrativesButton"
          className={ 'a-btn toggle-button ' + this._getNarrativesButtonClass() }
          onClick={ () => toggleFlag() }>
            Only complaints with narratives
        </button>
        <button
          id="refineToggleNoNarrativesButton"
          className={ 'a-btn toggle-button ' + this._getAllComplaintsButtonClass() }
          onClick={ () => toggleFlag() }>
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
  const searchField = state.query.searchField

  let phase = NOTHING
  if ( searchField === NARRATIVE_SEARCH_FIELD ) {
    phase = SEARCHING
  } else if ( isChecked ) {
    phase = FILTERING
  }

  return {
    options: {
      phase
    }
  }
}

export const mapDispatchToProps = dispatch => ( {
  toggleFlag: () => {
    dispatch( toggleFlagFilter( FIELD_NAME ) )
  }
} )

export default connect(
  mapStateToProps, mapDispatchToProps )( NarrativesButtons )
