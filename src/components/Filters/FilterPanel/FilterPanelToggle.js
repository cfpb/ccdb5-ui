import './FilterPanelToggle.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
import { updateFilterVisibility } from '../../../reducers/view/viewSlice';
import { selectViewHasFilters } from '../../../reducers/view/selectors';

export const FilterPanelToggle = () => {
  const dispatch = useDispatch();
  const hasFilters = useSelector(selectViewHasFilters);
  return (
    <section className={'filter-panel-toggle' + (hasFilters ? '' : ' u-mt30')}>
      <div className="m-btn-group">
        <Button
          label={hasFilters ? 'Close Filters' : 'Filter results'}
          className="filter-toggle-button"
          onClick={() => {
            dispatch(updateFilterVisibility());
          }}
        />
      </div>
    </section>
  );
};
