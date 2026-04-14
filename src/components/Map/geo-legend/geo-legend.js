import './geo-legend.scss';
import { useMemo } from 'react';
import { Heading } from '@cfpb/design-system-react';
import { useGetMap } from '../../../api/hooks/useGetMap';
import { STATE_DATA } from '../../../constants';
import { coalesce } from '../../../utils';
import {
  getBins,
  makeScale,
  makeShortName,
  TILE_MAP_COLORS,
} from '../TileChartMap/TileMap';

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
  const displayBins =
    legendBins.length > 5 ? legendBins.slice(1, 6) : legendBins;

  if (isLoading || isFetching || displayBins.length === 0) {
    return null;
  }

  const title = 'Complaint count by state';
  const legendDescription =
    'The tiles are shaded to reflect the complaint count for each state, based on the applied filters. Hover over a tile to view details or select a tile to add the state to your filters.';

  const formatRangeLabel = (bin, nextBin) => {
    if (!nextBin || !Number.isFinite(nextBin.from)) {
      return `≥ ${makeShortName(bin.from)}`;
    }

    let endValue = nextBin.from - 1;
    if (endValue < bin.from) {
      endValue = nextBin.from;
    }

    return `${makeShortName(bin.from)} – ${makeShortName(endValue)}`;
  };

  return (
    <div className="map-legend" aria-label="Map shading">
      <Heading type="4">{title}</Heading>
      <p className="map-legend__description">{legendDescription}</p>
      <ul className="map-legend__bins">
        {displayBins.map((bin, index) => {
          const nextBin = displayBins[index + 1];
          const label = formatRangeLabel(bin, nextBin);
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
