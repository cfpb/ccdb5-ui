import './geo-legend.scss';
import { useMemo } from 'react';
import { Heading } from '@cfpb/design-system-react';
import { useGetMap } from '../../../api/hooks/useGetMap';
import { STATE_DATA } from '../../../constants';
import { coalesce } from '../../../utils';
import { getBins, makeScale, TILE_MAP_COLORS } from '../TileChartMap/TileMap';

const buildBaseData = (stateMapResultsState) => {
  if (!stateMapResultsState) {
    return null;
  }

  return stateMapResultsState.map((state) => {
    const newState = structuredClone(state);
    const stateInfo = coalesce(STATE_DATA, state.name, {
      name: '',
    });
    newState.abbr = newState.name;
    newState.fullName = stateInfo.name;
    return newState;
  });
};

export const GeoLegend = () => {
  const { data: results, isLoading, isFetching } = useGetMap();
  const stateMapResultsState = results?.results?.state;

  const baseData = useMemo(
    () => buildBaseData(stateMapResultsState),
    [stateMapResultsState],
  );

  const displayData = useMemo(() => {
    if (!baseData) {
      return null;
    }

    return baseData.map((datum) => ({
      ...datum,
      displayValue: datum.value,
    }));
  }, [baseData]);

  const legendBins = useMemo(() => {
    if (!displayData || displayData.length === 0) {
      return [];
    }
    const scale = makeScale(displayData, TILE_MAP_COLORS);
    const quantiles = scale.quantiles();
    return getBins(quantiles, scale);
  }, [displayData]);

  if (isLoading || isFetching || legendBins.length === 0) {
    return null;
  }

  const title = 'Complaint count by state';
  const legendDescription =
    'The map is shaded to reflect the total complaint count based on the applied filters.';

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
