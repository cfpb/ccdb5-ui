import './MapToolbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../Common/Icon/iconMap';
import { MODE_LIST, THESE_UNITED_STATES } from '../../constants';
import { stateFilterCleared } from '../../reducers/filters/filtersSlice';
import { selectFiltersState } from '../../reducers/filters/selectors';
import { tabChanged } from '../../reducers/view/viewSlice';

export const MapToolbar = () => {
  const dispatch = useDispatch();
  const stateFilters = useSelector(selectFiltersState);
  const filteredStates = stateFilters
    ? stateFilters
        .filter((state) => state in THESE_UNITED_STATES)
        .map((state) => THESE_UNITED_STATES[state])
        .join(', ')
    : '';

  return (
    <div className="map-toolbar">
      <section className="state-heading">
        {!filteredStates && <span>United States of America</span>}
        <span>{filteredStates}</span>
        {!!filteredStates && (
          <button
            aria-label="Clear all map filters"
            className="a-btn a-btn--link"
            onClick={() => {
              dispatch(stateFilterCleared());
            }}
          >
            {getIcon('delete-round')}
            Clear
          </button>
        )}
      </section>
      {!!filteredStates && (
        <section className="state-navigation">
          <button
            className="list a-btn a-btn--link"
            onClick={() => {
              dispatch(tabChanged(MODE_LIST));
            }}
          >
            View complaints for filtered states
          </button>
        </section>
      )}
    </div>
  );
};
