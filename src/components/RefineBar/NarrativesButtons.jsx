import { addFilter, removeFilter } from '../../actions/filter'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

const FIELD_NAME = 'has_narrative'

export const NarrativesButtons = () => {
  const isChecked = useSelector( state => state.query[FIELD_NAME] || false );
  const dispatch = useDispatch();
  const _handleAddNarrative = () => {
    if ( !isChecked ) {
      dispatch( addFilter( FIELD_NAME, '' ) );
    }
  }

  const _handleRemoveNarrative = () => {
    if ( isChecked ) {
      dispatch( removeFilter( FIELD_NAME, '' ) )
    }
  }

  return (
      <section className="m-btn-group">
        <p>Read</p>
        <button
          id="refineToggleNarrativesButton"
          className={ `a-btn toggle-button ${
            isChecked ? 'selected' : 'deselected' }` }
          onClick={ () => _handleAddNarrative() }>
            Only complaints with narratives
        </button>
        <button
          id="refineToggleNoNarrativesButton"
          className={ `a-btn toggle-button ${
            isChecked ? 'deselected' : 'selected' }` }
          onClick={ () => _handleRemoveNarrative() }>
          All complaints
        </button>
      </section>
  )
}
