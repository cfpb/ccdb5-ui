import './MapToolbar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
import { THESE_UNITED_STATES } from '../../constants';
import {
  stateFilterCleared,
  stateFilterRemoved,
} from '../../reducers/filters/filtersSlice';
import { selectFiltersState } from '../../reducers/filters/selectors';
import { Pill } from '../Search/Pill';

export const MapToolbar = () => {
  const dispatch = useDispatch();
  const stateFilters = useSelector(selectFiltersState) || [];
  const filteredStates = stateFilters.filter(
    (state) => state in THESE_UNITED_STATES,
  );
  const hasFilters = filteredStates.length > 0;

  return (
    <div className="map-toolbar">
      <section className="state-heading">
        {!hasFilters && <span>United States of America</span>}
        {!!hasFilters && <span className="state-heading__title">State filters applied</span>}
      </section>
      {!!hasFilters && (
        <section className="state-filters">
          <ul className="state-filters__list m-tag-group">
            {filteredStates.map((abbr) => (
              <Pill
                key={abbr}
                fieldName="state"
                value={abbr}
                displayValue={THESE_UNITED_STATES[abbr]}
                onRemove={() => dispatch(stateFilterRemoved({ abbr }))}
              />
            ))}
            <li className="state-filters__clear">
              <Button
                appearance="warning"
                label="Clear state filters"
                isLink
                aria-label="Clear all state filters"
                className="state-filters__clear-button"
                onClick={() => {
                  dispatch(stateFilterCleared());
                }}
              />
            </li>
          </ul>
        </section>
      )}
    </div>
  );
};
