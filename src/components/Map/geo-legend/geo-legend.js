import './geo-legend.scss';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Heading } from '@cfpb/design-system-react';
import { useGetMap } from '../../../api/hooks/useGetMap';
import { GEO_NORM_NONE, STATE_DATA } from '../../../constants';
import { coalesce } from '../../../utils';
import { selectFiltersDataNormalization } from '../../../reducers/filters/selectors';
import {
  getBins,
  getPerCapitaBins,
  makeScale,
  TILE_MAP_COLORS,
} from '../TileChartMap/TileMap';

const getPerCapita = (stateObj, stateInfo) => {
  const pop = stateInfo.population;
  return ((stateObj.value / pop) * 1000).toFixed(2);
};

const buildBaseData = (stateMapResultsState) => {
  if (!stateMapResultsState) {
    return null;
  }

  return stateMapResultsState.map((state) => {
    const newState = structuredClone(state);
    const stateInfo = coalesce(STATE_DATA, state.name, {
      name: '',
      population: 1,
    });
    newState.abbr = newState.name;
    newState.fullName = stateInfo.name;
    newState.perCapita = getPerCapita(newState, stateInfo);
    return newState;
  });
};

export const GeoLegend = () => {
  const { data: results, isLoading, isFetching } = useGetMap();
  const dataNormalization = useSelector(selectFiltersDataNormalization);
  const stateMapResultsState = results?.results?.state;

  const baseData = useMemo(
    () => buildBaseData(stateMapResultsState),
    [stateMapResultsState],
  );

  const displayData = useMemo(() => {
    if (!baseData) {
      return null;
    }

    const showDefault = dataNormalization === GEO_NORM_NONE;
    return baseData.map((datum) => ({
      ...datum,
      displayValue: showDefault ? datum.value : datum.perCapita,
    }));
  }, [baseData, dataNormalization]);

  const legendBins = useMemo(() => {
    if (!displayData || displayData.length === 0) {
      return [];
    }
    const scale = makeScale(displayData, TILE_MAP_COLORS);
    const quantiles = scale.quantiles();
    return dataNormalization === GEO_NORM_NONE
      ? getBins(quantiles, scale)
      : getPerCapitaBins(quantiles, scale);
  }, [displayData, dataNormalization]);

  if (isLoading || isFetching || legendBins.length === 0) {
    return null;
  }

  const isPerCapita = dataNormalization !== GEO_NORM_NONE;
  const title = isPerCapita
    ? 'Complaints per 1,000 by state'
    : 'Complaint count by state';
  const legendDescription = isPerCapita
    ? 'The map is shaded to reflect complaints per 1,000 population based on the applied filters.'
    : 'The map is shaded to reflect the total complaint count based on the applied filters.';

  return (
    <div className="map-legend" aria-label="Map shading">
      <Heading type="4">{title}</Heading>
      <p className="map-legend__description">{legendDescription}</p>
      <ul className="map-legend__bins">
        {legendBins.map((bin) => {
          const label = bin.shortName || bin.name;
          return (
            <li className="map-legend__bin" key={`${bin.from}-${label}`}>
              <span
                className="map-legend__swatch"
                style={{ backgroundColor: bin.color }}
              />
              <p className="map-legend__label">{label}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
