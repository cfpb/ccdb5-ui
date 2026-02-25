import {
  filterAdded,
  filterRemoved,
} from '../../reducers/filters/filtersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
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
        <Button
          id="btn-add-narratives"
          label="Only complaints with narratives"
          className={'a-btn' + selectedClass(true, isNarrativesButtonDisabled)}
          disabled={isNarrativesButtonDisabled}
          onClick={() => {
            dispatch(filterAdded(FIELD_NAME, ''));
          }}
        />

        <Button
          id="btn-remove-narratives"
          label="All complaints"
          className={
            'a-btn' + selectedClass(false, !!isNarrativesButtonDisabled)
          }
          disabled={!isNarrativesButtonDisabled}
          onClick={() => {
            dispatch(filterRemoved(FIELD_NAME, ''));
          }}
        />
      </div>
    </section>
  );
};
