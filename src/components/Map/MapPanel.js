import '../RefineBar/RefineBar.less';
import { ActionBar } from '../ActionBar/ActionBar';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBlock from '../Warnings/Error';
import FilterPanel from '../Filters/FilterPanel';
import FilterPanelToggle from '../Filters/FilterPanelToggle';
import Loading from '../Dialogs/Loading';
import { MapToolbar } from './MapToolbar';
import { mapWarningDismissed } from '../../actions/view';
import { PerCapita } from '../RefineBar/PerCapita';
import { processRows } from '../../utils/chart';

import React, { useMemo } from 'react';
import RowChart from '../Charts/RowChart';
import { Separator } from '../RefineBar/Separator';
import { TabbedNavigation } from '../TabbedNavigation';
import TileChartMap from '../Charts/TileChartMap';
import Warning from '../Warnings/Warning';
import {
  selectMapActiveCall,
  selectMapError,
  selectMapResults,
} from '../../reducers/map/selectors';
import {
  selectViewExpandedRows,
  selectViewWidth,
} from '../../reducers/view/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQueryEnablePer1000,
  selectQueryMapWarningEnabled,
} from '../../reducers/query/selectors';
import { selectAggsTotal } from '../../reducers/aggs/selectors';
import { shortFormat } from '../../utils';

const WARNING_MESSAGE =
  '“Complaints per 1,000 population” is not available with your filter ' +
  'selections.';

const MAP_ROWCHART_HELPERTEXT =
  'Product the consumer identified in the complaint. Click on a product ' +
  'to expand sub-products';

export const MapPanel = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectMapActiveCall);
  const results = useSelector(selectMapResults);
  const hasError = useSelector(selectMapError);
  const maxDate = useSelector(selectQueryDateReceivedMax);
  const minDate = useSelector(selectQueryDateReceivedMin);
  const enablePer1000 = useSelector(selectQueryEnablePer1000);
  const mapWarningEnabled = useSelector(selectQueryMapWarningEnabled);
  const expandedRows = useSelector(selectViewExpandedRows);
  const total = useSelector(selectAggsTotal);
  const width = useSelector(selectViewWidth);

  const hasMobileFilters = width < 750;

  const productData = useMemo(() => {
    return processRows(results.product, false, 'Product', expandedRows);
  }, [results, expandedRows]);
  // eslint-disable-next-line complexity
  const MAP_ROWCHART_TITLE = useMemo(() => {
    return (
      'Product by highest complaint volume' +
      ' ' +
      shortFormat(minDate) +
      ' to ' +
      shortFormat(maxDate)
    );
  }, [maxDate, minDate]);

  const hasWarning = !enablePer1000 && mapWarningEnabled;

  const onDismissWarning = () => {
    dispatch(mapWarningDismissed());
  };

  return (
    <section className="map-panel">
      <ActionBar />
      <TabbedNavigation />
      {hasError && (
        <ErrorBlock text="There was a problem executing your search" />
      )}
      {hasWarning && (
        <Warning text={WARNING_MESSAGE} closeFn={onDismissWarning} />
      )}
      {hasMobileFilters && <FilterPanel />}
      <div className="layout-row refine-bar">
        <FilterPanelToggle />
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

      <Loading isLoading={!!isLoading} />
    </section>
  );
};

//
// MapPanel.propTypes = {
//   minDate: PropTypes.string.isRequired,
//   maxDate: PropTypes.string.isRequired,
//   hasError: PropTypes.bool,
//   hasWarning: PropTypes.bool,
//   onDismissWarning: PropTypes.func.isRequired,
//   hasMobileFilters: PropTypes.bool.isRequired,
//   productData: PropTypes.object.isRequired,
//   total: PropTypes.number.isRequired,
//   isLoading: PropTypes.bool,
// };
