/* eslint-disable complexity, camelcase */
import '../../RefineBar/RefineBar.less';
import './TrendsPanel.less';

import { useSelector, useDispatch } from 'react-redux';
import { lenses } from '../../../constants';
import {
  selectQueryCompany,
  selectQueryDateReceivedMin,
  selectQueryDateReceivedMax,
  selectQueryDateInterval,
  selectQueryLens,
  selectQuerySubLens,
  selectQueryTrendsDateWarningEnabled,
} from '../../../reducers/query/selectors';
import {
  selectTrendsChartType,
  selectTrendsColorMap,
  selectTrendsFocus,
  selectTrendsIsLoading,
  selectTrendsResults,
  selectTrendsTotal,
} from '../../../reducers/trends/selectors';
import {
  selectViewExpandedRows,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import { trendsDateWarningDismissed } from '../../../actions/view';
import { changeDateInterval } from '../../../actions/filter';
import { changeDataLens } from '../../../actions/trends';
import { processRows } from '../../../utils/chart';
import { shortFormat, sendAnalyticsEvent } from '../../../utils';
import { showCompanyOverLay, getIntervals } from '../../../utils/trends';
import { ActionBar } from '../../ActionBar/ActionBar';
import { TabbedNavigation } from '../../TabbedNavigation';
import Warning from '../../Warnings/Warning';
import { FilterPanel } from '../../Filters/FilterPanel';
import { FilterPanelToggle } from '../../Filters/FilterPanelToggle';
import Select from '../../RefineBar/Select';
import { Separator } from '../../RefineBar/Separator';
import { ChartToggles } from '../../RefineBar/ChartToggles';
import { CompanyTypeahead } from '../../Filters/CompanyTypeahead';
import { FocusHeader } from '../FocusHeader';
import { LineChart } from '../../Charts/LineChart/LineChart';
import { RowChart } from '../../Charts/RowChart/RowChart';
import { StackedAreaChart } from '../../Charts/StackedAreaChart/StackedAreaChart';
import { ExternalTooltip } from '../ExternalTooltip/ExternalTooltip';
import { TrendDepthToggle } from '../TrendDepthToggle';
import { Loading } from '../../Loading/Loading';
import { LensTabs } from '../LensTabs';

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
  const companyFilters = useSelector(selectQueryCompany);
  const dateInterval = useSelector(selectQueryDateInterval);
  const dateReceivedMin = useSelector(selectQueryDateReceivedMin);
  const dateReceivedMax = useSelector(selectQueryDateReceivedMax);
  const lens = useSelector(selectQueryLens);
  const subLens = useSelector(selectQuerySubLens);
  const isTrendsDateWarningEnabled = useSelector(
    selectQueryTrendsDateWarningEnabled,
  );
  const chartType = useSelector(selectTrendsChartType);
  const colorMap = useSelector(selectTrendsColorMap);
  const focus = useSelector(selectTrendsFocus);
  const isLoading = useSelector(selectTrendsIsLoading);
  const results = useSelector(selectTrendsResults);
  const total = useSelector(selectTrendsTotal);
  const expandedRows = useSelector(selectViewExpandedRows);
  const width = useSelector(selectViewWidth);

  const lensKey = lens.toLowerCase();
  const focusKey = subLens.replace('_', '-');
  const lensHelperText =
    subLens === '' ? lensHelperTextMap[lensKey] : lensHelperTextMap[subLens];
  const focusHelperText =
    subLens === '' ? focusHelperTextMap[lensKey] : focusHelperTextMap[subLens];
  const hasCompanyOverlay = showCompanyOverLay(lens, companyFilters, isLoading);
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
  const minDate = shortFormat(dateReceivedMin);
  const maxDate = shortFormat(dateReceivedMax);
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
    dispatch(changeDateInterval(value));
  };

  const onLens = (ev) => {
    const { value } = ev.target;
    sendAnalyticsEvent('Dropdown', 'Trends:' + value);
    dispatch(changeDataLens(value));
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
            <section className="chart">
              {chartType === 'line' && <LineChart />}
              {chartType === 'area' && <StackedAreaChart />}
            </section>
            {!hasOverview && <ExternalTooltip />}
          </div>
        </>
      ) : null}

      {total > 0 && phaseMap()}
      <TrendDepthToggle />
      <Loading isLoading={isLoading || false} />
    </section>
  );
};