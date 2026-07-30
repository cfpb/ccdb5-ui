import '../../refine-bar/refine-bar.scss';
import './trends-panel.scss';

import { useDispatch, useSelector } from 'react-redux';
import { lenses } from '../../../constants';
import {
  selectQueryDateInterval,
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
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
} from '../../../reducers/query/query-slice';
import { processRows } from '../../../utils/chart';
import { sendAnalyticsEvent } from '../../../utils';
import { getIntervals, showCompanyOverLay } from '../../../utils/trends';
import { Warning } from '../../warnings/warning';
import { FilterPanel } from '../../filters/filter-panel/filter-panel';
import { FilterPanelToggle } from '../../filters/filter-panel/filter-panel-toggle';
import { Select } from '../../refine-bar/select';
import { ChartToggles } from '../../refine-bar/chart-toggles';
import { FocusHeader } from '../focus-header/focus-header';
import { LineChart } from '../../charts/line-chart/line-chart';
import { RowChart } from '../../charts/row-chart/row-chart';
import { StackedAreaChart } from '../../charts/stacked-area-chart/stacked-area-chart';
import { ExternalTooltip } from '../external-tooltip/external-tooltip';
import { TrendDepthToggle } from '../trend-depth-toggle/trend-depth-toggle';
import { Loading } from '../../loading/loading';
import { LensTabs } from '../lens-tabs/lens-tabs';
import { selectFiltersCompany } from '../../../reducers/filters/selectors';
import { dataLensChanged } from '../../../reducers/trends/trends-slice';
import { formatDisplayDate } from '../../../utils/format-date';
import { useGetTrends } from '../../../api/hooks/use-get-trends';
import { ErrorBlock } from '../../warnings/error';
import { AsyncTypeahead } from '../../typeahead/async-typeahead/async-typeahead';
import { Heading, TabPanel } from '@cfpb/design-system-react';

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
  const { data, isLoading, isFetching, error } = useGetTrends();
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
  const lensHelperText = lensHelperTextMap[subLens === '' ? lensKey : subLens];
  const focusHelperText =
    focusHelperTextMap[subLens === '' ? lensKey : subLens];
  const results = error ? {} : data?.results || {};
  const colorMap = error ? {} : data?.colorMap;
  const total = error ? 0 : data?.total;

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
    }
    if (focus) {
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
      <LensTabs key="lens-tab" />,
      <TabPanel id={subLens || 'sub_product'} key={lens + 'panel'}>
        <RowChart
          id={lens}
          colorScheme={dataLensData.colorScheme}
          data={dataLensData.data}
          title={subLensTitle + ' ' + minDate + ' to ' + maxDate}
          helperText={lensHelperText}
          total={total}
        />
      </TabPanel>,
    ];
  };

  return (
    <section
      className={'trends-panel' + (hasOverview ? '' : ' external-tooltip')}
    >
      {isTrendsDateWarningEnabled ? (
        <Warning text={WARNING_MESSAGE} closeFn={onDismissWarning} />
      ) : null}
      {hasMobileFilters ? <FilterPanel /> : null}
      <FilterPanelToggle />
      <div className="refine-bar refine-bar--trends">
        <Select
          label="Aggregate by"
          values={lenses}
          id="lens"
          value={lens}
          handleChange={onLens}
        />
        <Select
          label="Date interval"
          values={intervals}
          id="interval"
          value={dateInterval}
          handleChange={onInterval}
        />
        {hasOverview ? null : <ChartToggles key="chart-toggles" />}
      </div>
      {error ? (
        <ErrorBlock text="There was a problem executing your search" />
      ) : null}

      {hasCompanyOverlay ? (
        <div className="layout-row company-overlay">
          <section className="company-search">
            <p>
              Choose a company to start your visualization using the type-ahead
              menu below. You can add more than one company to your view
            </p>
            <AsyncTypeahead
              htmlId="modal-search"
              fieldName="company"
              label="Start typing to begin listing companies"
              placeholder="Enter company name"
              ariaLabel="Type company name to view in detail"
            />
          </section>
        </div>
      ) : null}
      {focus ? <FocusHeader /> : null}
      {!hasCompanyOverlay && hasOverview && total > 0 ? (
        <div className="layout-row">
          <section className="chart-description">
            <Heading type="2" className="area-chart-title">
              {areaChartTitle()}
            </Heading>
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
            <Heading type="2" className="area-chart-title">
              {areaChartTitle()}
            </Heading>
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
