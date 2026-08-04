import '../refine-bar/refine-bar.scss';
import { useSelector } from 'react-redux';
import { ErrorBlock } from '../warnings/error';
import { FilterPanel } from '../filters/filter-panel/filter-panel';
import { FilterPanelToggle } from '../filters/filter-panel/filter-panel-toggle';
import { Loading } from '../loading/loading';
import { MapToolbar } from './map-toolbar';
import { processRows } from '../../utils/chart';
import { useMemo } from 'react';
import { RowChart } from '../charts/row-chart/row-chart';
import { TileChartMap } from './tile-chart-map/tile-chart-map';
import { GeoLegend } from './geo-legend/geo-legend';
import { MapStateNavigation } from './map-state-navigation';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../reducers/query/selectors';
import {
  selectViewExpandedRows,
  selectViewWidth,
} from '../../reducers/view/selectors';
import { formatDisplayDate } from '../../utils/format-date';
import { useGetAggregations } from '../../api/hooks/use-get-aggregations';
import { useGetMap } from '../../api/hooks/use-get-map';

export const MapPanel = () => {
  const { data, error } = useGetAggregations();
  const { data: results, isLoading, isFetching, error: hasError } = useGetMap();
  const total = error ? 0 : data?.total || 0;
  const maxDate = useSelector(selectQueryDateReceivedMax);
  const minDate = useSelector(selectQueryDateReceivedMin);
  const expandedRows = useSelector(selectViewExpandedRows);
  const width = useSelector(selectViewWidth);
  const hasMobileFilters = width < 750;
  const productData = useMemo(() => {
    if (hasError) {
      return { data: [], colorScheme: [] };
    }
    return (
      processRows(results?.results.product, false, 'Product', expandedRows) || {
        data: [],
        colorScheme: [],
      }
    );
  }, [hasError, results, expandedRows]);

  const productRows = productData?.data || [];
  const isPlural = productRows.filter((obj) => obj.isParent).length > 1;
  const prodText = isPlural ? 'Products' : 'Product';
  const MAP_ROWCHART_TITLE =
    prodText +
    ' by highest complaint volume ' +
    `(${formatDisplayDate(minDate)} to ${formatDisplayDate(maxDate)})`;

  const MAP_ROWCHART_HELPERTEXT = isPlural
    ? 'The chart below shows the products with the highest complaint volume, ' +
      'based on the applied filters. Expand each product to view sub-products.'
    : 'The chart below shows the product with the highest complaint volume, ' +
      'based on the applied filters. Expand the product to view sub-products.';

  return (
    <section className="map-panel">
      {!!hasMobileFilters && <FilterPanel />}
      <FilterPanelToggle />
      {hasError ? (
        <ErrorBlock text="There was a problem executing your search" />
      ) : (
        <>
          <TileChartMap />
          <GeoLegend />
          <MapToolbar />
          <RowChart
            id="product"
            colorScheme={productData.colorScheme}
            data={productData.data}
            title={MAP_ROWCHART_TITLE}
            helperText={MAP_ROWCHART_HELPERTEXT}
            total={total}
          />
          <MapStateNavigation />
        </>
      )}
      <Loading isLoading={isLoading || isFetching} />
    </section>
  );
};
