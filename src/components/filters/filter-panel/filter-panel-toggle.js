import './filter-panel-toggle.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
import { updateFilterVisibility } from '../../../reducers/view/view-slice';
import { selectViewHasFilters } from '../../../reducers/view/selectors';

export const FilterPanelToggle = () => {
  const dispatch = useDispatch();
  const hasFilters = useSelector(selectViewHasFilters);
  return (
    <section className={'filter-panel-toggle' + (hasFilters ? '' : ' u-mt30')}>
      <div className="m-btn-group">
        <Button
          label={hasFilters ? 'Close filters' : 'Filter results'}
          className="filter-panel-toggle__button"
          onClick={() => {
            dispatch(updateFilterVisibility());
          }}
          iconRight={hasFilters ? 'error' : 'filter'}
        />
      </div>
    </section>
  );
};
