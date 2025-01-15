import '../../RefineBar/RefineBar.scss';
import './TrendsPanel.scss';

import { useSelector, useDispatch } from 'react-redux';
import { lenses } from '../../../constants';
import {
  selectQueryDateReceivedMin,
  selectQueryDateReceivedMax,
  selectQueryDateInterval,
  selectQueryTrendsDateWarningEnabled,
} from '../../../reducers/query/selectors';
import {
  selectTrendsChartType,
  selectTrendsFocus,
  selectTrendsLens,
  selectTrendsSubLens,
} from '../../../reducers/trends/selectors';
import {
  selectViewExpandedRows,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import {
  dateIntervalChanged,
  trendsDateWarningDismissed,
} from '../../../reducers/query/querySlice';
import { processRows } from '../../../utils/chart';
import { sendAnalyticsEvent } from '../../../utils';
import { showCompanyOverLay, getIntervals } from '../../../utils/trends';
import { ActionBar } from '../../ActionBar/ActionBar';
import { TabbedNavigation } from '../../TabbedNavigation/TabbedNavigation';
import { Warning } from '../../Warnings/Warning';
import { FilterPanel } from '../../Filters/FilterPanel/FilterPanel';
import { FilterPanelToggle } from '../../Filters/FilterPanel/FilterPanelToggle';
import { Select } from '../../RefineBar/Select';
import { Separator } from '../../RefineBar/Separator';
import { ChartToggles } from '../../RefineBar/ChartToggles';
import { CompanyTypeahead } from '../../Filters/Company/CompanyTypeahead';
import { FocusHeader } from '../FocusHeader/FocusHeader';
import { LineChart } from '../../Charts/LineChart/LineChart';
import { RowChart } from '../../Charts/RowChart/RowChart';
import { StackedAreaChart } from '../../Charts/StackedAreaChart/StackedAreaChart';
import { ExternalTooltip } from '../ExternalTooltip/ExternalTooltip';
import { TrendDepthToggle } from '../TrendDepthToggle/TrendDepthToggle';
import { Loading } from '../../Loading/Loading';
import { LensTabs } from '../LensTabs/LensTabs';
import { selectFiltersCompany } from '../../../reducers/filters/selectors';
import { dataLensChanged } from '../../../reducers/trends/trendsSlice';
import { formatDisplayDate } from '../../../utils/formatDate';
import { useGetTrends } from '../../../api/hooks/useGetTrends';

const WARNING_MESSAGE =
  '“Day” interval is disabled when the date range is longer than one year';

const subLensMap = {
  sub_product: 'Sub-products',
  sub_issue: 'Sub-issues',
  issue: 'Issues',
  product: 'Products',
};

const lensHelperTextMap = {
  product:
    'Product the consumer identified in the complaint.' +
    ' Click on a company name to expand products.',
  company:
    'Product the consumer identified in the complaint. Click on' +
    ' a company name to expand products.',
  sub_product:
    'Product and sub-product the consumer identified in the ' +
    ' complaint. Click on a product to expand sub-products.',
  issue:
    'Product and issue the consumer identified in the complaint.' +
    ' Click on a product to expand issues.',
  overview:
    'Product the consumer identified in the complaint. Click on a ' +
    ' product to expand sub-products',
};

const focusHelperTextMap = {
  sub_product: 'Sub-products the consumer identified in the complaint',
  product: 'Product the consumer identified in the complaint',
  issue: 'Issues the consumer identified in the complaint',
};

export const TrendsPanel = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetTrends();
  const companyFilters = useSelector(selectFiltersCompany);
  const dateInterval = useSelector(selectQueryDateInterval);
  const dateReceivedMin = useSelector(selectQueryDateReceivedMin);
  const dateReceivedMax = useSelector(selectQueryDateReceivedMax);
  const isTrendsDateWarningEnabled = useSelector(
    selectQueryTrendsDateWarningEnabled,
  );

  const chartType = useSelector(selectTrendsChartType);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const subLens = useSelector(selectTrendsSubLens);

  const expandedRows = useSelector(selectViewExpandedRows);
  const width = useSelector(selectViewWidth);

  const lensKey = lens.toLowerCase();
  const focusKey = subLens.replace('_', '-');
  const lensHelperText =
    subLens === '' ? lensHelperTextMap[lensKey] : lensHelperTextMap[subLens];
  const focusHelperText =
    subLens === '' ? focusHelperTextMap[lensKey] : focusHelperTextMap[subLens];
  const results = data?.results || {};
  const colorMap = data?.colorMap;
  const total = data?.total;

  const hasCompanyOverlay = showCompanyOverLay(
    lens,
    companyFilters,
    isLoading || isFetching,
  );
  const focusData = processRows(
    results[focusKey],
    colorMap,
    lens,
    expandedRows,
  );
  const intervals = getIntervals(dateReceivedMin, dateReceivedMax);
  const productData = processRows(results.product, false, lens, expandedRows);
  const dataLensData = processRows(
    results[lensKey],
    colorMap,
    lens,
    expandedRows,
  );
  const minDate = formatDisplayDate(dateReceivedMin);
  const maxDate = formatDisplayDate(dateReceivedMax);
  const hasOverview = lens === 'Overview';
  const hasMobileFilters = width < 750;
  const subLensTitle =
    subLensMap[subLens] + ', by ' + lens.toLowerCase() + ' from';

  const onDismissWarning = () => {
    dispatch(trendsDateWarningDismissed());
  };

  const onInterval = (ev) => {
    const { value } = ev.target;
    sendAnalyticsEvent('Dropdown', 'Trends:' + value);
    dispatch(dateIntervalChanged(value));
  };

  const onLens = (ev) => {
    const { value } = ev.target;
    sendAnalyticsEvent('Dropdown', 'Trends:' + value);
    dispatch(dataLensChanged(value));
  };

  const areaChartTitle = () => {
    if (hasOverview) {
      return 'Complaints by date received by the CFPB';
    } else if (focus) {
      return (
        'Complaints by ' +
        subLensMap[subLens].toLowerCase() +
        ', by date received by the CFPB'
      );
    }
    return 'Complaints by date received by the CFPB';
  };

  const phaseMap = () => {
    if (hasCompanyOverlay) {
      return null;
    }

    if (hasOverview) {
      return (
        <RowChart
          id="product"
          colorScheme={productData.colorScheme}
          data={productData.data}
          title={
            'Product by highest complaint volume ' + minDate + ' to ' + maxDate
          }
          helperText={lensHelperText}
          total={total}
        />
      );
    }

    if (focus) {
      return (
        <RowChart
          id={lens}
          colorScheme={focusData.colorScheme}
          data={focusData.data}
          title={subLensTitle + ' ' + minDate + ' to ' + maxDate}
          helperText={focusHelperText}
          total={total}
        />
      );
    }

    return [
      <LensTabs key="lens-tab" showTitle={true} />,
      <RowChart
        id={lens}
        colorScheme={dataLensData.colorScheme}
        data={dataLensData.data}
        title={subLensTitle + ' ' + minDate + ' to ' + maxDate}
        helperText={lensHelperText}
        total={total}
        key={lens + 'row'}
      />,
    ];
  };

  return (
    <section
      className={'trends-panel' + (!hasOverview ? ' external-tooltip' : '')}
    >
      <ActionBar />
      <TabbedNavigation />
      {isTrendsDateWarningEnabled ? (
        <Warning text={WARNING_MESSAGE} closeFn={onDismissWarning} />
      ) : null}
      {hasMobileFilters ? <FilterPanel /> : null}
      <FilterPanelToggle />
      <div className="layout-row refine-bar">
        <Select
          label="Aggregate complaints by"
          title="Aggregate by"
          values={lenses}
          id="lens"
          value={lens}
          handleChange={onLens}
        />
        <Separator />
        <Select
          label="Choose the Date interval"
          title="Date interval"
          values={intervals}
          id="interval"
          value={dateInterval}
          handleChange={onInterval}
        />
        {!hasOverview
          ? [
              <Separator key="separator" />,
              <ChartToggles key="chart-toggles" />,
            ]
          : null}
      </div>
      {hasCompanyOverlay ? (
        <div className="layout-row company-overlay">
          <section className="company-search">
            <p>
              Choose a company to start your visualization using the type-ahead
              menu below. You can add more than one company to your view
            </p>
            <CompanyTypeahead id="modal-search" />
          </section>
        </div>
      ) : null}
      {focus ? <FocusHeader /> : null}
      {!hasCompanyOverlay && hasOverview && total > 0 ? (
        <div className="layout-row">
          <section className="chart-description">
            <h2 className="area-chart-title">{areaChartTitle()}</h2>
            <p className="chart-helper-text">
              A time series graph of complaints for the selected date range.
              Hover on the chart to see the count for each date interval. Your
              filter selections will update what you see on the graph.
            </p>
          </section>
        </div>
      ) : null}
      {!hasCompanyOverlay && !hasOverview && total > 0 ? (
        <div className="layout-row">
          <section className="chart-description">
            <h2 className="area-chart-title">{areaChartTitle()}</h2>
            <p className="chart-helper-text">
              A time series graph of the (up to five) highest volume complaints
              for the selected date range. However, you can view all of your
              selections in the bar chart, below. Hover on the chart to see the
              count for each date interval. Your filter selections will update
              what you see on the graph.
            </p>
          </section>
        </div>
      ) : null}
      {!hasCompanyOverlay && total > 0 ? (
        <>
          <div className="layout-row date-range-disclaimer">
            <strong>
              Note:&nbsp; Data from incomplete time intervals are not shown
            </strong>
          </div>
          <div className="layout-row">
            <>
              {chartType === 'line' && <LineChart />}
              {chartType === 'area' && <StackedAreaChart />}
            </>
            {!hasOverview && <ExternalTooltip />}
          </div>
        </>
      ) : null}
      {total > 0 && phaseMap()}
      <TrendDepthToggle />
      <Loading isLoading={isLoading || isFetching} />
    </section>
  );
};
