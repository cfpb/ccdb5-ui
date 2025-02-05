import { useDispatch, useSelector } from 'react-redux';
import { NARRATIVE_SEARCH_FIELD } from '../../../constants';
import { toggleFlagFilter } from '../../../reducers/filters/filtersSlice';
import { selectFiltersHasNarrative } from '../../../reducers/filters/selectors';
import { selectQuerySearchField } from '../../../reducers/query/selectors';

const FIELD_NAME = 'has_narrative';

const SEARCHING = 'SEARCHING';
const FILTERING = 'FILTERING';
const NOTHING = 'NOTHING';

// ----------------------------------------------------------------------------
// The Class

export const HasNarrative = () => {
  const dispatch = useDispatch();
  const isChecked = useSelector(selectFiltersHasNarrative);
  const searchField = useSelector(selectQuerySearchField);
  let phase = NOTHING;
  if (searchField === NARRATIVE_SEARCH_FIELD) {
    phase = SEARCHING;
  } else if (isChecked) {
    phase = FILTERING;
  }

  return (
    <section className="single-checkbox">
      <h4>Only show complaints with narratives?</h4>
      <div className="m-form-field m-form-field--checkbox">
        <input
          className="a-checkbox"
          checked={phase !== NOTHING}
          disabled={phase === SEARCHING}
          id="filterHasNarrative"
          onChange={() => {
            dispatch(toggleFlagFilter(FIELD_NAME));
          }}
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
