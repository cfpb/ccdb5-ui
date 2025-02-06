import './TileChartMap.scss';
import {
  stateFilterAdded,
  stateFilterRemoved,
} from '../../../reducers/filters/filtersSlice';
import { coalesce, sendAnalyticsEvent } from '../../../utils';
import { GEO_NORM_NONE, STATE_DATA } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import TileMap from './TileMap';
import {
  selectFiltersDataNormalization,
  selectFiltersState,
} from '../../../reducers/filters/selectors';

import {
  selectViewIsPrintMode,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import { useGetMap } from '../../../api/hooks/useGetMap';

export const TileChartMap = () => {
  const dispatch = useDispatch();
  const dataNormalization = useSelector(selectFiltersDataNormalization);
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
            population: 1,
          });
          newState.abbr = newState.name;
          newState.fullName = stateInfo.name;
          newState.perCapita = getPerCapita(newState, stateInfo);
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
    const mapElement = document.getElementById('tile-chart-map');
    const mapWidth = isPrintMode ? 650 : mapElement.clientWidth || width;
    if (!data) {
      return;
    }

    const dataSet = updateData(data, dataNormalization, stateFilters);

    const options = {
      el: mapElement,
      data: dataSet,
      isPerCapita: dataNormalization !== GEO_NORM_NONE,
      events: {
        // custom event handlers we can pass on
        click: _toggleState,
      },
      hasTip,
      width: mapWidth,
    };

    options.height = mapWidth * 0.75;

    // eslint-disable-next-line no-unused-vars
    const chart = new TileMap(options);
  }, [
    data,
    dataNormalization,
    hasTip,
    isPrintMode,
    stateFilters,
    width,
    _toggleState,
  ]);

  useEffect(() => {
    _redrawMap();
    return function cleanup() {
      const mapElement = document.getElementById('tile-chart-map');
      if (mapElement) {
        while (mapElement.firstChild) {
          mapElement.firstChild.remove();
        }
      }
    };
  }, [_redrawMap]);

  return (
    <div>
      <div
        id="tile-chart-map"
        className={`cfpb-chart ${isPrintMode ? 'print' : ''}`}
        data-chart-type="tile_map"
        data-testid="tile-chart-map"
      />
    </div>
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
 * Helper function to calculate Per Capita value
 *
 * @param {object} stateObj - A state containing abbr and value
 * @param {object} stateInfo - other information about the state
 * @returns {string} the Per 1000 population value
 */
function getPerCapita(stateObj, stateInfo) {
  const pop = stateInfo.population;
  return ((stateObj.value / pop) * 1000).toFixed(2);
}

/**
 * Helper function to get display value of tile based on Normalization.
 *
 * @param {Array} data - Tiles to display.
 * @param {string} dataNormalization - Whether to normalize the data.
 * @param {Array} statesFilter - The currently applied states filter.
 * @returns {object} Data provided to tile map
 */
function updateData(data, dataNormalization, statesFilter) {
  const showDefault = dataNormalization === GEO_NORM_NONE;
  const res = data.map((datum) => ({
    ...datum,
    displayValue: showDefault ? datum.value : datum.perCapita,
    className: getStateClass(statesFilter, datum.name),
  }));

  return res;
}
