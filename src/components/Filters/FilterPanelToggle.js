import './FilterPanelToggle.less';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilterVisibility } from '../../reducers/view/viewSlice';
import { selectViewHasFilters } from '../../reducers/view/selectors';

export const FilterPanelToggle = () => {
  const dispatch = useDispatch();
  const hasFilters = useSelector(selectViewHasFilters);
  return (
    <section className="filter-panel-toggle">
      <div className="m-btn-group">
        <p>&nbsp;</p>
        <button
          className="a-btn"
          onClick={() => {
            dispatch(updateFilterVisibility());
          }}
        >
          {hasFilters ? 'Close Filters' : 'Filter results'}
        </button>
      </div>
    </section>
  );
};
