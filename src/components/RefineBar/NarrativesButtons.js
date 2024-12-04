import {
  filterAdded,
  filterRemoved,
} from '../../reducers/filters/filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectedClass } from '../../utils';
import { selectFiltersHasNarrative } from '../../reducers/filters/selectors';

const FIELD_NAME = 'has_narrative';

export const NarrativesButtons = () => {
  const dispatch = useDispatch();
  const hasNarrative = useSelector(selectFiltersHasNarrative);
  const isNarrativesButtonDisabled = hasNarrative === true;

  return (
    <section className="narratives-buttons">
      <p>Read</p>
      <div className="m-btn-group">
        <button
          id="btn-add-narratives"
          className={'a-btn' + selectedClass(true, isNarrativesButtonDisabled)}
          disabled={isNarrativesButtonDisabled}
          onClick={() => {
            dispatch(filterAdded(FIELD_NAME, ''));
          }}
        >
          Only complaints with narratives
        </button>

        <button
          id="btn-remove-narratives"
          className={
            'a-btn' + selectedClass(false, !!isNarrativesButtonDisabled)
          }
          disabled={!isNarrativesButtonDisabled}
          onClick={() => {
            dispatch(filterRemoved(FIELD_NAME, ''));
          }}
        >
          All complaints
        </button>
      </div>
    </section>
  );
};
