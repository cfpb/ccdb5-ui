import { coalesce } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { NARRATIVE_SEARCH_FIELD } from '../../constants';
import React from 'react';
import { toggleFlagFilter } from '../../actions/filter';
import { selectQueryState } from '../../reducers/query/selectors';

const FIELD_NAME = 'has_narrative';

const SEARCHING = 'SEARCHING';
const FILTERING = 'FILTERING';
const NOTHING = 'NOTHING';

// ----------------------------------------------------------------------------

export const HasNarrative = () => {
  const dispatch = useDispatch();
  const query = useSelector(selectQueryState);

  const isChecked = coalesce(query, FIELD_NAME, false);
  const searchField = query.searchField;

  let phase = NOTHING;
  if (searchField === NARRATIVE_SEARCH_FIELD) {
    phase = SEARCHING;
  } else if (isChecked) {
    phase = FILTERING;
  }

  return (
    <section className="single-checkbox">
      <h4>Only show complaints with narratives?</h4>
      <div className="m-form-field m-form-field__checkbox">
        <input
          className="a-checkbox"
          checked={phase !== NOTHING}
          disabled={phase === SEARCHING}
          id="filterHasNarrative"
          onChange={() => dispatch(toggleFlagFilter(FIELD_NAME))}
          type="checkbox"
          value={FIELD_NAME}
        />
        <label className="a-label" htmlFor="filterHasNarrative">
          Yes
        </label>
      </div>
    </section>
  );
};
