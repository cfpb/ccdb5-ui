import './MapToolbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
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
          <Button
            label="Clear"
            iconLeft="delete-round"
            asLink
            aria-label="Clear all map filters"
            onClick={() => {
              dispatch(stateFilterCleared());
            }}
          />
        )}
      </section>
      {!!filteredStates && (
        <section className="state-navigation">
          <Button
            label="View complaints for filtered states"
            asLink
            className="list a-btn a-btn--link"
            onClick={() => {
              dispatch(tabChanged(MODE_LIST));
            }}
          />
        </section>
      )}
    </div>
  );
};
