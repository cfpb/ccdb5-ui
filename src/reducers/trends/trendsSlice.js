/* eslint max-nested-callbacks: ["error", 4] */

// reducer for the Map Tab
import * as colors from '../../constants/colors';
import { clamp, getSubKeyName } from '../../utils';
import { enforceValues, validateTrendsReducer } from '../../utils/reducers';
import {
  getD3Names,
  getTooltipTitle,
  updateDateBuckets,
} from '../../utils/chart';
import { isDateEqual } from '../../utils/formatDate';
import { MODE_TRENDS } from '../../constants';
import { pruneOther } from '../../utils/trends';
import { createSlice } from '@reduxjs/toolkit';

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
      rowNames.filter((item) => item.name !== 'Other').map((item) => item.name),
    ),
  ];

  for (let idx = 0; idx < uniqueNames.length; idx++) {
    const name = uniqueNames[idx];
    const index = clamp(idx, 0, 10);
    colScheme[name] = colorScheme[index];
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
 *
 * @param {object} state - reducer values we use to process aggs
 * @param {object} data - contains aggregations from api
 * @returns {object} processed trends for Area and Line Chart
 */
export function trendsReceived(state, data) {
  const aggregations = { ...data };
  const { focus, lens, subLens } = state;
  const results = {
    dateRangeArea: [],
    dateRangeLine: [],
  };
  const kR = 'dateRangeArea';
  const hits = aggregations[kR].doc_count;

  // if hits > 0
  // no hits, so reset defaults
  if (hits === 0) {
    return {
      ...state,
      results: {},
      tooltip: false,
      total: 0,
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

  state.colorMap = getColorScheme(lens, results.dateRangeArea);
  state.results = results;
  state.total = total;
  state.subLens = lens === 'Company' ? 'product' : state.subLens;

  return state;
}
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
  keys.forEach((key) => {
    /* istanbul ignore else */
    if (aggregations[key]) {
      results[key] = processBucket(state, aggregations[key][key].buckets);
    }
  });
}

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

  for (let index = 0; index < agg.length; index++) {
    processTrendPeriod(agg[index]);

    const item = agg[index];
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
    }),
  );

  // overall buckets
  aggregations.dateRangeBuckets.dateRangeBuckets.buckets.forEach((obj) => {
    if (!compBuckets.find((val) => obj.key_as_string === val.date)) {
      compBuckets.push({
        name: mainName,
        value: 0,
        date: obj.key_as_string,
      });
    }
  });

  // reference buckets to backfill zero values
  const refBuckets = Object.assign({}, compBuckets);
  const trendResults = aggregations[filter][filter].buckets.slice(0, 5);

  for (let index = 0; index < trendResults.length; index++) {
    const result = trendResults[index];
    // only take first 10 of the buckets for processing
    const reverseBuckets = result.trend_period.buckets.reverse();
    for (let idx = 0; idx < reverseBuckets.length; idx++) {
      const bucket = reverseBuckets[idx];
      compBuckets.push({
        name: result.key,
        value: bucket.doc_count,
        date: bucket.key_as_string,
      });

      // delete total from that date
      const pos = compBuckets.findIndex(
        (cBuck) =>
          cBuck.name === mainName &&
          isDateEqual(cBuck.date, bucket.key_as_string),
      );

      /* istanbul ignore else */
      if (pos > -1) {
        // subtract the value from total, so we calculate the "Other" bin
        compBuckets[pos].value -= bucket.doc_count;
      }
    }

    // we're missing a bucket, so fill it in.
    const referenceBuckets = Object.values(refBuckets);
    if (result.trend_period.buckets.length !== referenceBuckets.length) {
      for (let index = 0; index < referenceBuckets.length; index++) {
        const obj = referenceBuckets[index];
        const datePoint = compBuckets
          .filter((bckt) => bckt.name === result.key)
          .find((bckt) => isDateEqual(bckt.date, obj.date));
        if (!datePoint) {
          compBuckets.push({
            name: result.key,
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
      dates: areaBuckets.map((obj) => ({
        date: obj.key_as_string,
        value: obj.doc_count,
      })),
    });

    // backfill empties
    rangeBuckets.forEach((obj) => {
      if (!dataByTopic[0].dates.find((val) => obj.key_as_string === val.date)) {
        dataByTopic[0].dates.push({
          date: obj.key_as_string,
          value: 0,
        });
      }
    });

    // sort dates so it doesn't break line chart
    dataByTopic[0].dates.sort(
      (first, second) => new Date(first.date) - new Date(second.date),
    );
  }

  if (lens !== 'Overview') {
    // handle Focus Case
    const lensKey = focus ? subLens.replace('_', '-') : lens.toLowerCase();
    const aggBuckets = aggregations[lensKey][lensKey].buckets;
    for (let index = 0; index < aggBuckets.length; index++) {
      const name = aggBuckets[index].key;
      const dateBuckets = updateDateBuckets(
        name,
        aggBuckets[index].trend_period.buckets,
        rangeBuckets,
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
    for (let index = 0; index < subaggBuckets.length; index++) {
      subaggBuckets[index].parent = bucket.key;
      processTrendPeriod(subaggBuckets[index]);
    }
  }
}

// the minimal State to reset to when things break
export const trendsState = {
  chartType: 'line',
  focus: '',
  lens: 'Product',
  subLens: 'sub_product',
  tooltip: false,
  trendDepth: 5,
};

export const trendsSlice = createSlice({
  name: 'trends',
  initialState: trendsState,
  reducers: {
    chartTypeUpdated: {
      reducer: (state, action) => {
        state.chartType = state.lens === 'Overview' ? 'line' : action.payload;
        state.tooltip = false;
      },
    },
    dataLensChanged: {
      reducer: (state, action) => {
        state.subLens = '';
        const lens = enforceValues(action.payload, 'lens');
        switch (lens) {
          case 'Company':
            state.subLens = 'product';
            break;
          case 'Overview':
            state.subLens = 'product';
            state.chartType = 'line';
            break;
          case 'Product':
            state.subLens = 'sub_product';
            break;
          default:
            break;
        }

        state.focus = '';
        state.lens = lens;
        state.tooltip = false;
        state.trendDepth = lens === 'Company' ? 10 : 5;
      },
    },
    dataSubLensChanged: {
      reducer: (state, action) => {
        return {
          ...state,
          subLens: action.payload.toLowerCase(),
        };
      },
    },
    depthChanged: {
      reducer: (state, action) => {
        state.trendDepth = action.payload;
      },
    },
    depthReset: {
      reducer: (state) => {
        state.trendDepth = 5;
      },
    },
    focusChanged: {
      reducer: (state, action) => {
        const { focus, lens } = action.payload;
        state.focus = focus;
        state.lens = enforceValues(lens, 'lens');
        state.tooltip = false;
        state.trendDepth = 25;
        validateTrendsReducer(state);
      },
      prepare: (focus, lens, filterValues) => {
        return {
          payload: { focus, lens, filterValues },
        };
      },
    },
    focusRemoved: {
      reducer: (state) => {
        return {
          ...state,
          focus: '',
          tooltip: false,
          trendDepth: 5,
        };
      },
    },
    tooltipUpdated: {
      reducer: (state, action) => {
        const tooltip = action.payload.date ? action.payload : false;

        // need to merge in the actual viewed state
        if (tooltip) {
          tooltip.title = getTooltipTitle(
            tooltip.date,
            tooltip.interval,
            tooltip.dateRange,
            true,
          );

          /* istanbul ignore else */
          if (tooltip.values) {
            let total = 0;
            total = tooltip.values.reduce(
              (accumulator, currentValue) => accumulator + currentValue.value,
              total,
            );
            tooltip.total = total;
          }
        }

        return {
          ...state,
          tooltip,
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('filters/filtersCleared', (state) => {
        state.focus = '';
      })
      .addCase('filters/multipleFiltersRemoved', (state, action) => {
        // remove the focus if it exists in one of the filter values we are removing
        state.focus = action.payload.values.includes(state.focus)
          ? ''
          : state.focus;
      })
      .addCase('routes/routeChanged', (state, action) => {
        const params = action.payload.params;
        // Handle flag filters
        const filters = ['chartType', 'focus', 'lens', 'subLens'];
        for (const val of filters) {
          if (params[val]) {
            state[val] = enforceValues(params[val], val);
          }
        }
        validateTrendsReducer(state);
      })
      .addCase('view/tabChanged', (state, action) => {
        return {
          ...state,
          focus: action.payload === MODE_TRENDS ? state.focus : '',
        };
      });
  },
});

export const {
  chartTypeUpdated,
  dataLensChanged,
  dataSubLensChanged,
  depthChanged,
  depthReset,
  focusChanged,
  focusRemoved,
  tooltipUpdated,
} = trendsSlice.actions;

export default trendsSlice.reducer;
