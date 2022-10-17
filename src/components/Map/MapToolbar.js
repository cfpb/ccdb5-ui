import './MapToolbar.less';
import { clearStateFilter, showStateComplaints } from '../../actions/map';
import { useDispatch, useSelector } from 'react-redux';
import iconMap from '../iconMap';
import React from 'react';
import { THESE_UNITED_STATES } from '../../constants';
import { selectQueryStateAggs } from '../../reducers/query/selectors';

export const MapToolbar = () => {
  const abbrs = useSelector(selectQueryStateAggs);
  const dispatch = useDispatch();

  const filteredStates = abbrs
    ? abbrs
        .filter((x) => x in THESE_UNITED_STATES)
        .map((x) => THESE_UNITED_STATES[x])
        .join(', ')
    : '';

  return (
    <div className="map-toolbar">
      <section className="state-heading">
        {!filteredStates && <span>United States of America</span>}
        <span>{filteredStates}</span>
        {filteredStates && (
          <a
            aria-label="Clear all map filters"
            className="clear"
            onClick={() => {
              dispatch(clearStateFilter());
            }}
          >
            {iconMap.getIcon('delete-round')}
            Clear
          </a>
        )}
      </section>
      {filteredStates && (
        <section className="state-navigation">
          <a
            className="list"
            onClick={() => {
              dispatch(showStateComplaints());
            }}
          >
            View complaints for filtered states
          </a>
        </section>
      )}
    </div>
  );
};
