import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import {
  useGetAggregationsQuery,
  useGetDocumentQuery,
  useGetListQuery,
  useGetMapQuery,
  useGetTrendsQuery,
} from './complaints';
import {
  aggResponse,
  listAPIResponse,
  listResponse,
} from '../components/List/ListPanel/fixture';
import { geoAPIResponse, geoResponse } from '../components/Map/fixture';
import {
  trendsAPIResponse,
  trendsResponse,
} from '../components/Trends/fixture';

import fetchMock from 'jest-fetch-mock';
import { waitFor } from '@testing-library/react';
import { aggResponseTransformed, documentResponse } from './fixture';

fetchMock.enableMocks();

/**
 *
 * @param {object} react - node
 * @param {object} react.children - nodes
 * @returns {object} rendered nodes
 */
// eslint-disable-next-line react/prop-types
function Wrapper({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getAggregations', () => {
  it('renders hook and handles error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const { result } = renderHook(
      () => useGetAggregationsQuery({ foo: 'bar' }),
      {
        wrapper: Wrapper,
      },
    );
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getAggregations',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(fetchMock).toBeCalledTimes(1);
  });

  it('renders hook and transforms data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    const { result } = renderHook(
      () => useGetAggregationsQuery({ foo: 'bar' }),
      {
        wrapper: Wrapper,
      },
    );
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getAggregations',
      isLoading: false,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toBeCalledTimes(1);
    expect(result.current.data).toEqual(aggResponseTransformed);
  });
});

describe('getDocument', () => {
  it('renders hook and handles errors', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const { result } = renderHook(() => useGetDocumentQuery(1234), {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getDocument',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(fetchMock).toBeCalledTimes(1);
  });
  it('renders hook transforms data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(documentResponse));
    const { result } = renderHook(() => useGetDocumentQuery(12334), {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getDocument',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toBeCalledTimes(1);
    expect(result.current.data).toEqual({
      company: 'JPMORGAN CHASE & CO.',
      company_public_response: 'Company acknowledges the complaint',
      company_response: 'Closed with explanation',
      complaint_id: '2371744',
      complaint_what_happened: 'Lorem ipsum dolor sit amet',
      consumer_consent_provided: 'Consent provided',
      consumer_disputed: 'Yes',
      date_received: '2017-03-04T12:00:00',
      date_sent_to_company: '2017-03-04T12:00:00',
      has_narrative: true,
      issue: 'Account opening, closing, or management',
      product: 'Bank account or service',
      state: 'KY',
      sub_issue: 'Closing',
      sub_product: 'Checking account',
      submitted_via: 'Web',
      tags: 'Older American',
      timely: 'Yes',
      zip_code: '423XX',
    });
  });
});

describe('getList', () => {
  it('renders hook and handles errors', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const { result } = renderHook(() => useGetListQuery({ foo: 'bar' }), {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getList',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(fetchMock).toBeCalledTimes(1);
  });
  it('renders hook and transforms data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(listResponse));
    const { result } = renderHook(() => useGetListQuery({ foo: 'bar' }), {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getList',
      isLoading: false,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toBeCalledTimes(1);
    expect(result.current.data).toEqual(listAPIResponse);
  });
});

describe('getMap', () => {
  it('renders hook and handles error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const { result } = renderHook(() => useGetMapQuery({ foo: 'bar' }), {
      wrapper: Wrapper,
    });

    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getMap',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(fetchMock).toBeCalledTimes(1);
  });
  it('renders hook and transforms data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(geoResponse));
    const { result } = renderHook(() => useGetMapQuery({ foo: 'bar' }), {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getMap',
      isLoading: false,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toBeCalledTimes(1);
    expect(result.current.data).toEqual(geoAPIResponse);
  });
});

describe('getTrends', () => {
  it('renders hook and handles error', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));
    const { result } = renderHook(() => useGetTrendsQuery({ foo: 'bar' }), {
      wrapper: Wrapper,
    });
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getTrends',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(false));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(fetchMock).toBeCalledTimes(1);
  });

  it('renders hook and transforms data', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(trendsResponse));

    const { result } = renderHook(
      () =>
        useGetTrendsQuery({
          reducerValues: {
            chartType: 'line',
            focus: '',
            lens: 'Product',
            subLens: 'sub_product',
            tooltip: false,
            trendDepth: 5,
          },
        }),
      {
        wrapper: Wrapper,
      },
    );
    expect(result.current).toMatchObject({
      status: 'pending',
      endpointName: 'getTrends',
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: true,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toBeCalledTimes(1);
    expect(result.current.data).toEqual(trendsAPIResponse);
  });
});
