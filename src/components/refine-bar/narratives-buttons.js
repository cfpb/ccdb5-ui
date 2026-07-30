import {
  filterAdded,
  filterRemoved,
} from '../../reducers/filters/filters-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup } from '@cfpb/design-system-react';
import { selectFiltersHasNarrative } from '../../reducers/filters/selectors';

const FIELD_NAME = 'has_narrative';

export const NarrativesButtons = () => {
  const dispatch = useDispatch();
  const hasNarrative = useSelector(selectFiltersHasNarrative);
  const hasNarrativesOnly = hasNarrative === true;

  return (
    <section className="narratives-buttons">
      <div className="a-label a-label--heading" id="view-label">
        View
      </div>
      <ButtonGroup aria-labelledby="view-label">
        <Button
          id="btn-remove-narratives"
          label="All complaints"
          appearance="secondary"
          className={hasNarrativesOnly ? '' : 'active'}
          aria-pressed={!hasNarrativesOnly}
          onClick={() => {
            if (!hasNarrativesOnly) {
              return;
            }
            dispatch(filterRemoved(FIELD_NAME, ''));
          }}
        />
        <Button
          id="btn-add-narratives"
          label="Complaints with narratives"
          appearance="secondary"
          className={hasNarrativesOnly ? 'active' : ''}
          aria-pressed={hasNarrativesOnly}
          onClick={() => {
            if (hasNarrativesOnly) {
              return;
            }
            dispatch(filterAdded(FIELD_NAME, ''));
          }}
        />
      </ButtonGroup>
    </section>
  );
};
