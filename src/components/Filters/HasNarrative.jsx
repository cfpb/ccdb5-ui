import { coalesce } from '../../utils';
import { connect } from 'react-redux';
import { NARRATIVE_SEARCH_FIELD } from '../../constants';
import PropTypes from 'prop-types';
import React from 'react';
import { toggleFlagFilter } from '../../actions/filter';


const FIELD_NAME = 'has_narrative';

const SEARCHING = 'SEARCHING';
const FILTERING = 'FILTERING';
const NOTHING = 'NOTHING';

/* ----------------------------------------------------------------------------
   The Class */

export class HasNarrative extends React.Component {
  render() {
    const { options, toggleFlag } = this.props;
    return (
      <section className='single-checkbox'>
        <h4>Only show complaints with narratives?</h4>
        <div className='m-form-field m-form-field__checkbox'>
          <input className='a-checkbox'
            checked={ options.phase !== NOTHING }
            disabled={ options.phase === SEARCHING }
            id='filterHasNarrative'
            onChange={ () => toggleFlag() }
            type='checkbox'
            value={ FIELD_NAME } />
          <label className='a-label' htmlFor='filterHasNarrative'>Yes</label>
        </div>
      </section>
    );
  }
}

/* ----------------------------------------------------------------------------
   Meta */

HasNarrative.propTypes = {
  isChecked: PropTypes.bool
};

export const mapStateToProps = state => {
  const isChecked = coalesce( state.query, FIELD_NAME, false );
  const searchField = state.query.searchField;

  let phase = NOTHING;
  if ( searchField === NARRATIVE_SEARCH_FIELD ) {
    phase = SEARCHING;
  } else if ( isChecked ) {
    phase = FILTERING;
  }

  return {
    options: {
      phase
    }
  };
};

export const mapDispatchToProps = dispatch => ( {
  toggleFlag: () => {
    dispatch( toggleFlagFilter( FIELD_NAME ) );
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( HasNarrative );
