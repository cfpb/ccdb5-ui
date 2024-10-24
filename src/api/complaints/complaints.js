import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_PLACEHOLDER } from '../../constants';

export const complaintsApi = createApi({
  // Set the baseUrl for every endpoint below
  baseQuery: fetchBaseQuery({ baseUrl: API_PLACEHOLDER }),
  endpoints: (builder) => ({
    getDocument: builder.query({
      query: (id) => `${id}`,
      transformResponse: (response) => {
        console.log(response);

        return response.hits.hits[0]._source;
      },
    }),
    // getList: builder.query({
    //   query: (params) => `${params}&no_aggs=true`,
    // }),
    // getMap: builder.query({
    //   query: (params) => `states${params}&no_aggs=true`,
    // }),
    // getTrends: builder.query({
    //   query: (params) => `trends?${params}`,
    // }),
  }),
});

export const { useGetDocumentQuery } = complaintsApi;
