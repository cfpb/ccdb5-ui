import '../RefineBar/RefineBar.scss';
import { ActionBar } from '../ActionBar/ActionBar';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBlock } from '../Warnings/Error';
import { FilterPanel } from '../Filters/FilterPanel/FilterPanel';
import { FilterPanelToggle } from '../Filters/FilterPanel/FilterPanelToggle';
import { Loading } from '../Loading/Loading';
import { MapToolbar } from './MapToolbar';
import { mapWarningDismissed } from '../../reducers/filters/filtersSlice';
import { PerCapita } from '../RefineBar/PerCapita';
import { processRows } from '../../utils/chart';

import { useMemo } from 'react';
import { RowChart } from '../Charts/RowChart/RowChart';
import { Separator } from '../RefineBar/Separator';
import { TabbedNavigation } from '../TabbedNavigation/TabbedNavigation';
import { TileChartMap } from './TileChartMap/TileChartMap';
import { Warning } from '../Warnings/Warning';
import {
  selectFiltersEnablePer1000,
  selectFiltersMapWarningEnabled,
} from '../../reducers/filters/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../reducers/query/selectors';

import {
  selectViewExpandedRows,
  selectViewWidth,
} from '../../reducers/view/selectors';

import { formatDisplayDate } from '../../utils/formatDate';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';
import { useGetMap } from '../../api/hooks/useGetMap';

const WARNING_MESSAGE =
  '“Complaints per 1,000 population” is not available with your filter ' +
  'selections.';

const MAP_ROWCHART_HELPERTEXT =
  'Product the consumer identified in the complaint. Click on a product ' +
  'to expand sub-products';

export const MapPanel = () => {
  const dispatch = useDispatch();
  const { data } = useGetAggregations();
  const { data: results, isLoading, isFetching, error: hasError } = useGetMap();
  const total = data?.total || 0;
  const enablePer1000 = useSelector(selectFiltersEnablePer1000);
  const mapWarningEnabled = useSelector(selectFiltersMapWarningEnabled);
  const maxDate = useSelector(selectQueryDateReceivedMax);
  const minDate = useSelector(selectQueryDateReceivedMin);
  const expandedRows = useSelector(selectViewExpandedRows);
  const width = useSelector(selectViewWidth);
  const hasMobileFilters = width < 750;
  const hasWarning = !enablePer1000 && mapWarningEnabled;
  const productData = useMemo(() => {
    return processRows(
      results?.results.product,
      false,
      'Product',
      expandedRows,
    );
  }, [results, expandedRows]);

  const MAP_ROWCHART_TITLE = `Product by highest complaint volume ${formatDisplayDate(
    minDate,
  )} to ${formatDisplayDate(maxDate)}`;

  const onDismissWarning = () => {
    dispatch(mapWarningDismissed());
  };

  return (
    <section className="map-panel">
      <ActionBar />
      <TabbedNavigation />
      {!!hasError && (
        <ErrorBlock text="There was a problem executing your search" />
      )}
      {!!hasWarning && (
        <Warning text={WARNING_MESSAGE} closeFn={onDismissWarning} />
      )}
      {!!hasMobileFilters && <FilterPanel />}
      <FilterPanelToggle />
      <div className="layout-row refine-bar">
        <Separator />
        <PerCapita />
      </div>
      <TileChartMap />
      <MapToolbar />
      <RowChart
        id="product"
        colorScheme={productData.colorScheme}
        data={productData.data}
        title={MAP_ROWCHART_TITLE}
        helperText={MAP_ROWCHART_HELPERTEXT}
        total={total}
      />

      <Loading isLoading={isLoading || isFetching} />
    </section>
  );
};
