import './tile-chart-map.scss';
import {
  stateFilterAdded,
  stateFilterRemoved,
} from '../../../reducers/filters/filters-slice';
import { coalesce, sendAnalyticsEvent } from '../../../utils';
import { STATE_DATA } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import TileMap, { TILE_MAP_HEIGHT, TILE_MAP_WIDTH } from './tile-map';
import { selectFiltersState } from '../../../reducers/filters/selectors';

import {
  selectViewIsPrintMode,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import { useGetMap } from '../../../api/hooks/use-get-map';
import { getElementById } from '../../../utils/dom';

export const TileChartMap = () => {
  const dispatch = useDispatch();
  const stateFilters = useSelector(selectFiltersState);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const width = useSelector(selectViewWidth);

  const { data: results } = useGetMap();
  const stateMapResultsState = results?.results.state;

  const data = useMemo(() => {
    return stateMapResultsState
      ? stateMapResultsState.map((state) => {
          const newState = structuredClone(state);
          const stateInfo = coalesce(STATE_DATA, state.name, {
            name: '',
          });
          newState.abbr = newState.name;
          newState.fullName = stateInfo.name;
          return newState;
        })
      : null;
  }, [stateMapResultsState]);

  const hasTip = !isPrintMode;
  const _toggleState = useCallback(
    (event) => {
      // pass in redux dispatch
      // point.fullName
      const { abbr, fullName } = event.point;
      const selectedState = {
        abbr,
        // rename this for consistency
        // chart builder uses fullName
        name: fullName,
      };
      if (stateFilters && stateFilters.includes(abbr)) {
        sendAnalyticsEvent('State Event: remove', selectedState.abbr);
        dispatch(stateFilterRemoved(selectedState));
      } else {
        sendAnalyticsEvent('State Event: add', selectedState.abbr);
        dispatch(stateFilterAdded(selectedState));
      }
    },
    [stateFilters, dispatch],
  );

  const _redrawMap = useCallback(() => {
    if (!data) {
      return;
    }

    const mapElement = getElementById('tile-chart-map');
    const containerWidth = mapElement.clientWidth || width;
    const mapWidth = isPrintMode ? 650 : containerWidth;

    const dataSet = updateData(data, stateFilters);

    const options = {
      el: mapElement,
      data: dataSet,
      events: {
        // custom event handlers we can pass on
        click: _toggleState,
      },
      hasTip,
      width: mapWidth,
    };

    const tileAspect = TILE_MAP_HEIGHT / TILE_MAP_WIDTH;
    // add more height when filters collapse and window is small
    const modifier = width < 750 ? 50 : 0;
    options.height = Math.round(mapWidth * tileAspect) + modifier;

    new TileMap(options);
  }, [data, hasTip, isPrintMode, stateFilters, width, _toggleState]);

  useEffect(() => {
    _redrawMap();
    return function cleanup() {
      const mapElement = getElementById('tile-chart-map');
      if (mapElement) {
        mapElement.replaceChildren();
      }
    };
  }, [_redrawMap]);

  return (
    <div
      id="tile-chart-map"
      className={`cfpb-chart ${isPrintMode ? 'print' : ''}`}
      data-chart-type="tile_map"
    />
  );
};

export const getStateClass = (statesFilter, name) => {
  // no filters so no classes.
  if (!statesFilter || statesFilter.length === 0) {
    return '';
  }

  return statesFilter.includes(name) ? 'selected' : 'deselected';
};

/**
 * Helper function to get display value of tile based on Normalization.
 *
 * @param {Array} data - Tiles to display.
 * @param {Array} statesFilter - The currently applied states filter.
 * @returns {object} Data provided to tile map
 */
function updateData(data, statesFilter) {
  const res = data.map((datum) => ({
    ...datum,
    displayValue: datum.value,
    className: getStateClass(statesFilter, datum.name),
  }));

  return res;
}
