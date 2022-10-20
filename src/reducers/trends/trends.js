/* eslint max-nested-callbacks: ["error", 4] */
/* eslint-disable camelcase */

// reducer for the Map Tab
import * as colors from '../../constants/colors';
import {
  clamp,
  coalesce,
  getSubKeyName,
  processErrorMessage,
} from '../../utils';
import { enforceValues, validateTrendsReducer } from '../../utils/reducers';
import {
  getD3Names,
  getTooltipTitle,
  updateDateBuckets,
} from '../../utils/chart';
import actions from '../../actions';
import { isDateEqual } from '../../utils/formatDate';
import { MODE_TRENDS } from '../../constants';
import { pruneOther } from '../../utils/trends';

export const emptyResults = () => ({
  dateRangeArea: [],
  dateRangeLine: [],
});

// the minimal State to reset to when things break
export const getResetState = () => ({
  activeCall: '',
  colorMap: {},
  error: false,
  isLoading: false,
  results: emptyResults(),
  tooltip: false,
  total: 0,
});

export const getDefaultState = () =>
  Object.assign(
    {},
    {
      chartType: 'line',
      focus: '',
      lens: 'Product',
      subLens: 'sub_product',
    },
    { ...getResetState() }
  );

export const defaultTrends = getDefaultState();

// ----------------------------------------------------------------------------
// Helpers
/**
 * helper function to process all of the aggregations and fill out results
 *
 * @param {Array} keys - list of aggs we check product, issue, company, etc
 * @param {object} state - redux state
 * @param {object} aggregations - coming from the APIO
 * @param {object} results - object we are processing and filling out
 */
export function processAggregations(keys, state, aggregations, results) {
  keys.forEach((k) => {
    /* istanbul ignore else */
    if (aggregations[k]) {
      results[k] = processBucket(state, aggregations[k][k].buckets);
    }
  });
}

/* eslint-disable complexity */
/**
 * helper function to drill down a bucket and generate special names for D3
 *
 * @param {object} state - the state in redux
 * @param {Array} agg - list of aggregations to go through
 * @returns {object} the representative bar in a d3 row chart
 */
export function processBucket(state, agg) {
  const list = [];
  // default is either Overview / Product
  const tabLabels =
    state.lens === 'Company' ? 'product' : 'sub-product and issue';

  for (let i = 0; i < agg.length; i++) {
    processTrendPeriod(agg[i]);

    const item = agg[i];
    const subKeyName = getSubKeyName(item);

    item.isParent = true;
    const subItem = item[subKeyName];
    item.hasChildren = Boolean(subItem && subItem.buckets.length);

    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_omit
    // Create a parent row.
    // remove the lodash omit since it is deprecated in lodash5
    const tempItem = Object.assign({}, item);
    delete tempItem[subKeyName];
    list.push(tempItem);

    /* istanbul ignore else */
    if (subItem && subItem.buckets && subItem.buckets.length) {
      const expandableBuckets = subItem.buckets;
      // if there's buckets we need to add a separator for rendering
      const labelText = `Visualize ${tabLabels} trends for ${item.key} >`;
      expandableBuckets.push({
        hasChildren: false,
        isParent: false,
        key: labelText,
        name: labelText,
        splitterText: labelText,
        value: '',
        parent: item.key,
        width: 0.5,
      });

      list.push(expandableBuckets);
    }
  }

  const nameMap = [];

  // return flattened list
  return [].concat(...list).map((obj) => getD3Names(obj, nameMap));
}

/**
 * helper function to pluralize field values
 *
 * @param {lens} lens - value we are processing
 * @returns {string} for consumption by AreaData function
 */
export function mainNameLens(lens) {
  if (lens === 'Product') {
    return 'products';
  } else if (lens === 'Company') {
    return 'companies';
  }
  return 'values';
}

/**
 * processes the stuff for the area chart, combining them if necessary
 *
 * @param {object} state - redux state
 * @param {object} aggregations - coming from the trends api
 * @returns {object} the data areas for the stacked area chart
 */
function processAreaData(state, aggregations) {
  // map subLens / focus values to state
  const { focus, lens, subLens } = state;
  const filter = focus
    ? subLens.replace('_', '-').toLowerCase()
    : lens.toLowerCase();
  const mainName = 'Other';
  const compBuckets = aggregations.dateRangeArea.dateRangeArea.buckets.map(
    (obj) => ({
      name: mainName,
      value: obj.doc_count,
      date: obj.key_as_string,
    })
  );

  // overall buckets
  aggregations.dateRangeBuckets.dateRangeBuckets.buckets.forEach((o) => {
    if (!compBuckets.find((v) => o.key_as_string === v.date)) {
      compBuckets.push({
        name: mainName,
        value: 0,
        date: o.key_as_string,
      });
    }
  });

  // reference buckets to backfill zero values
  const refBuckets = Object.assign({}, compBuckets);
  const trendResults = aggregations[filter][filter].buckets.slice(0, 5);

  for (let i = 0; i < trendResults.length; i++) {
    const o = trendResults[i];
    // only take first 10 of the buckets for processing
    const reverseBuckets = o.trend_period.buckets.reverse();
    for (let j = 0; j < reverseBuckets.length; j++) {
      const p = reverseBuckets[j];
      compBuckets.push({
        name: o.key,
        value: p.doc_count,
        date: p.key_as_string,
      });

      // delete total from that date
      const pos = compBuckets.findIndex(
        (k) => k.name === mainName && isDateEqual(k.date, p.key_as_string)
      );

      /* istanbul ignore else */
      if (pos > -1) {
        // subtract the value from total, so we calculate the "Other" bin
        compBuckets[pos].value -= p.doc_count;
      }
    }

    // we're missing a bucket, so fill it in.
    const referenceBuckets = Object.values(refBuckets);
    if (o.trend_period.buckets.length !== referenceBuckets.length) {
      for (let k = 0; k < referenceBuckets.length; k++) {
        const obj = referenceBuckets[k];
        const datePoint = compBuckets
          .filter((f) => f.name === o.key)
          .find((f) => isDateEqual(f.date, obj.date));
        if (!datePoint) {
          compBuckets.push({
            name: o.key,
            value: 0,
            date: obj.date,
          });
        }
      }
    }
  }

  // we should prune 'Other' if all of the values are zero
  return pruneOther(compBuckets);
}

/**
 * Process aggs and convert them into a format for Line Charts
 *
 * @param {string} lens - Overview, Issue, Product, etc
 * @param {object} aggregations - comes from the API
 * @param {string} focus - if a focus item was selected
 * @param {string} subLens - current subLens
 * @returns {{dataByTopic: ([{dashed: boolean, show: boolean, topic: string,
 * topicName: string, dates: *}]|[])}} theformatted object containing line info
 */
function processLineData(lens, aggregations, focus, subLens) {
  const areaBuckets = aggregations.dateRangeArea.dateRangeArea.buckets;
  const rangeBuckets = aggregations.dateRangeBuckets.dateRangeBuckets.buckets;
  const dataByTopic = [];
  if (lens === 'Overview') {
    dataByTopic.push({
      topic: 'Complaints',
      topicName: 'Complaints',
      dashed: false,
      show: true,
      dates: areaBuckets.map((o) => ({
        date: o.key_as_string,
        value: o.doc_count,
      })),
    });

    // backfill empties
    rangeBuckets.forEach((o) => {
      if (!dataByTopic[0].dates.find((v) => o.key_as_string === v.date)) {
        dataByTopic[0].dates.push({
          date: o.key_as_string,
          value: 0,
        });
      }
    });

    // sort dates so it doesn't break line chart
    dataByTopic[0].dates.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  if (lens !== 'Overview') {
    // handle Focus Case
    const lensKey = focus ? subLens.replace('_', '-') : lens.toLowerCase();
    const aggBuckets = aggregations[lensKey][lensKey].buckets;
    for (let i = 0; i < aggBuckets.length; i++) {
      const name = aggBuckets[i].key;
      const dateBuckets = updateDateBuckets(
        name,
        aggBuckets[i].trend_period.buckets,
        rangeBuckets
      );
      dataByTopic.push({
        topic: name,
        topicName: name,
        dashed: false,
        show: true,
        dates: dateBuckets,
      });
    }
  }
  return {
    dataByTopic: dataByTopic.slice(0, 5),
  };
}

/**
 * processes the aggregation buckets set the parent rows for expandable chart
 *
 * @param {object} bucket - subagg bucket with difference intervals
 */
export function processTrendPeriod(bucket) {
  const subKeyName = getSubKeyName(bucket);
  if (bucket[subKeyName]) {
    const subaggBuckets = bucket[subKeyName].buckets;
    for (let j = 0; j < subaggBuckets.length; j++) {
      subaggBuckets[j].parent = bucket.key;
      processTrendPeriod(subaggBuckets[j]);
    }
  }
}

/**
 * helper function to map color schemes to available data
 *
 * @param {string} lens - selected data lens
 * @param {Array} rowNames - rows that are in the stacked area charts
 * @returns {object} contains Name:Color map
 */
export const getColorScheme = (lens, rowNames) => {
  const colScheme = {};
  const colorScheme = colors.DataLens;
  // remove other so we can shove that color in later
  const uniqueNames = [
    ...new Set(
      rowNames.filter((item) => item.name !== 'Other').map((item) => item.name)
    ),
  ];

  for (let i = 0; i < uniqueNames.length; i++) {
    const n = uniqueNames[i];
    const index = clamp(i, 0, 10);
    colScheme[n] = colorScheme[index];
  }

  colScheme.Complaints = colors.BriteCharts.regular;

  // Set constant grey colors for all possible "other" buckets"
  colScheme.Other = colors.DataLens[10];
  colScheme['All other products'] = colors.DataLens[10];
  colScheme['All other companies'] = colors.DataLens[10];
  colScheme['All other values'] = colors.DataLens[10];
  return colScheme;
};

/**
 * Copies the results locally
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function processTrends(state, action) {
  const aggregations = action.data.aggregations;
  const { focus, lens, subLens } = state;
  const results = emptyResults();
  const kR = 'dateRangeArea';
  const hits = aggregations[kR].doc_count;

  // if hits > 0
  // no hits, so reset defaults
  if (hits === 0) {
    const resetState = getResetState();
    return {
      ...state,
      ...resetState,
    };
  }

  const total = aggregations[kR].doc_count;

  if (lens !== 'Overview') {
    results[kR] = processAreaData(state, aggregations);
  }

  results.dateRangeLine = processLineData(lens, aggregations, focus, subLens);

  // based on these criteria, the following aggs should only exist
  const keyMap = {
    Overview: ['product'],
    Company: ['company'],
    Product: ['product'],
    'Product-focus': ['sub-product', 'issue'],
    'Company-focus': ['product'],
  };
  let keyFilter = lens;

  if (focus) {
    keyFilter += '-focus';
  }

  const keys = keyMap[keyFilter];

  processAggregations(keys, state, aggregations, results);

  const colorMap = getColorScheme(lens, results.dateRangeArea);

  return {
    ...state,
    activeCall: '',
    colorMap,
    error: false,
    isLoading: false,
    results,
    total,
  };
}

/* eslint-enable complexity */

// ----------------------------------------------------------------------------
// Action Handlers
/**
 * Updates the state when an tab changed occurs, reset values to start clean
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the tab we are changing to
 * @returns {object} the new state for the Redux store
 */
export function handleTabChanged(state, action) {
  return {
    ...state,
    focus: action.tab === MODE_TRENDS ? state.focus : '',
    results: emptyResults(),
  };
}

/**
 * Updates the state when an aggregations call is in progress
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} the new state for the Redux store
 */
export function trendsCallInProcess(state, action) {
  return {
    ...state,
    activeCall: action.url,
    isLoading: true,
    tooltip: false,
  };
}

/**
 * handling errors from an aggregation call
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processTrendsError(state, action) {
  const emptyState = getResetState();
  return {
    ...state,
    ...emptyState,
    error: processErrorMessage(action.error),
  };
}

/**
 * Handler for the update chart type action, dont allow area when Overview
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateChartType(state, action) {
  return {
    ...state,
    chartType: action.chartType,
    tooltip: false,
  };
}

/**
 * Handler for the update data lens action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDataLens(state, action) {
  const lens = enforceValues(action.lens, 'lens');

  return {
    ...state,
    focus: '',
    lens,
    results: emptyResults(),
    tooltip: false,
  };
}

/**
 * Handler for the update sub lens action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDataSubLens(state, action) {
  return {
    ...state,
    subLens: action.subLens,
  };
}

/**
 * Handler for the focus selected action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function changeFocus(state, action) {
  const { focus, lens } = action;
  return {
    ...state,
    focus,
    lens,
    tooltip: false,
  };
}

/**
 * Handler for the focus removed action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function removeFocus(state) {
  return {
    ...state,
    focus: '',
    results: emptyResults(),
    tooltip: false,
  };
}

/**
 * Processes an object of key/value strings into the correct internal format
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} a filtered set of key/value pairs with the values set to
 * the correct type
 */
function processParams(state, action) {
  const params = action.params;
  const processed = Object.assign({}, defaultTrends);

  // Handle flag filters
  const filters = ['chartType', 'focus', 'lens', 'subLens'];
  for (const val of filters) {
    if (params[val]) {
      processed[val] = enforceValues(params[val], val);
    }
  }

  return processed;
}

/**
 * Handler for the tooltipUpdate action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function updateTooltip(state, action) {
  const tooltip = action.value || false;

  // need to merge in the actual viewed state
  if (tooltip) {
    tooltip.title = getTooltipTitle(
      tooltip.date,
      tooltip.interval,
      tooltip.dateRange,
      true
    );

    /* istanbul ignore else */
    if (tooltip.values) {
      tooltip.values.forEach((o) => {
        o.colorIndex =
          Object.values(colors.DataLens).indexOf(state.colorMap[o.name]) || 0;
        // make sure all values have a value
        o.value = coalesce(o, 'value', 0);
      });

      let total = 0;
      total = tooltip.values.reduce(
        (accumulator, currentValue) => accumulator + currentValue.value,
        total
      );
      tooltip.total = total;
    }
  }

  return {
    ...state,
    tooltip,
  };
}

/**
 * reset the filters selected for the focus too
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function removeAllFilters(state) {
  return {
    ...state,
    focus: '',
  };
}

/**
 * Removes multiple filters from the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filters to remove
 * @returns {object} the new state for the Redux store
 */
function removeMultipleFilters(state, action) {
  const focus = action.values.includes(state.focus) ? '' : state.focus;
  return {
    ...state,
    focus,
  };
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Creates a hash table of action types to handlers
 *
 * @returns {object} a map of types to functions
 */
export function _buildHandlerMap() {
  const handlers = {};

  handlers[actions.CHART_TYPE_CHANGED] = updateChartType;
  handlers[actions.DATA_LENS_CHANGED] = updateDataLens;
  handlers[actions.DATA_SUBLENS_CHANGED] = updateDataSubLens;
  handlers[actions.FILTER_ALL_REMOVED] = removeAllFilters;
  handlers[actions.FILTER_MULTIPLE_REMOVED] = removeMultipleFilters;
  handlers[actions.FOCUS_CHANGED] = changeFocus;
  handlers[actions.FOCUS_REMOVED] = removeFocus;
  handlers[actions.TAB_CHANGED] = handleTabChanged;
  handlers[actions.TRENDS_API_CALLED] = trendsCallInProcess;
  handlers[actions.TRENDS_FAILED] = processTrendsError;
  handlers[actions.TRENDS_RECEIVED] = processTrends;
  handlers[actions.TRENDS_TOOLTIP_CHANGED] = updateTooltip;
  handlers[actions.URL_CHANGED] = processParams;

  return handlers;
}

const _handlers = _buildHandlerMap();

/**
 * Routes an action to an appropriate handler
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function handleSpecificAction(state, action) {
  if (action.type in _handlers) {
    return _handlers[action.type](state, action);
  }

  return state;
}

export default (state = defaultTrends, action) => {
  const newState = handleSpecificAction(state, action);
  validateTrendsReducer(newState);
  return newState;
};
