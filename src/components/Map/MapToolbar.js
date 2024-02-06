import './MapToolbar.less';
import { clearStateFilter, showStateComplaints } from '../../actions/map';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../iconMap';
import React from 'react';
import { THESE_UNITED_STATES } from '../../constants';
import { selectQueryStateFilters } from '../../reducers/query/selectors';

export const MapToolbar = () => {
  const dispatch = useDispatch();
  const stateFilters = useSelector(selectQueryStateFilters);
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
            onClick={() => {
              dispatch(clearStateFilter());
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
            className="list"
            onClick={() => {
              dispatch(showStateComplaints());
            }}
          >
            View complaints for filtered states
          </button>
        </section>
      )}
    </div>
  );
};
