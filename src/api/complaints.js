import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PLACEHOLDER } from '../constants';
import {
  processAggregations,
  trendsReceived,
} from '../reducers/trends/trendsSlice';
import { processStateAggregations } from '../utils/map';
import queryString from 'query-string';

export const complaintsApi = createApi({
  // Set the baseUrl for every endpoint below
  baseQuery: fetchBaseQuery({ baseUrl: API_PLACEHOLDER }),
  keepUnusedDataFor: 60 * 60, // time in seconds, 1 hour
  endpoints: (builder) => ({
    getAggregations: builder.query({
      query: (params) => ({
        url: `?${queryString.stringify(params)}`,
      }),
      transformResponse: (response) => {
        if (!response) {
          return {};
        }
        const respObject = {};
        const aggs = response.aggregations;
        const keys = Object.keys(aggs);

        respObject.doc_count = Math.max(
          response.hits.total.value,
          response._meta.total_record_count,
        );
        respObject.lastUpdated = response._meta.last_updated;
        respObject.lastIndexed = response._meta.last_indexed;
        respObject.hasDataIssue = response._meta.has_data_issue;
        respObject.isDataStale = response._meta.is_data_stale;
        respObject.total = response.hits.total.value;

        keys.forEach((key) => {
          respObject[key] = aggs[key][key].buckets;
        });
        return respObject;
      },
    }),
    getDocument: builder.query({
      query: (id) => `${id}`,
      transformResponse: (response) => response.hits.hits[0]._source,
    }),
    getList: builder.query({
      query: (params) => ({
        url: `?${queryString.stringify(params)}`,
      }),
      transformResponse: (response) => {
        const breakPoints = response._meta.break_points;
        const hits = response.hits.hits.map((hit) => {
          const item = { ...hit._source };

          if (hit.highlight) {
            Object.keys(hit.highlight).forEach((field) => {
              item[field] = hit.highlight[field][0];
            });
          }

          return item;
        });

        const totalPages = Object.keys(breakPoints).length + 1;
        return {
          breakPoints,
          hits,
          totalPages,
        };
      },
    }),
    getMap: builder.query({
      query: (params) => `geo/states?${queryString.stringify(params)}`,
      transformResponse: (response) => {
        const { aggregations } = response;
        const state = { product: [], state: [] };
        // add in "issue" if we ever need issue row chart again
        const keys = ['product'];
        const results = {};
        processAggregations(keys, state, aggregations, results);
        results.state = processStateAggregations(aggregations.state);
        return {
          results,
        };
      },
    }),
    getTrends: builder.query({
      query: (params) => {
        const newP = { ...params };
        delete newP.reducerValues;
        return {
          url: `trends?${queryString.stringify(newP)}`,
        };
      },
      transformResponse: (response, meta, arg) => {
        if (!response) {
          return {};
        }
        const { aggregations } = response;
        const state = { ...arg.reducerValues };
        return trendsReceived(state, aggregations);
      },
    }),
  }),
});

export const {
  useGetAggregationsQuery,
  useGetDocumentQuery,
  useGetListQuery,
  useGetMapQuery,
  useGetTrendsQuery,
} = complaintsApi;
