import target, {
  aggregationsCallInProcess,
  aggState,
  processAggregationError,
  processAggregationResults,
} from './aggs';

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});

    expect(actual).toEqual(aggState);
  });

  it('handles aggregationsCallInProcess actions', () => {
    const action = {
      url: 'foobar',
    };

    expect(target({}, aggregationsCallInProcess(action))).toEqual({
      activeCall: 'foobar',
      isLoading: true,
    });
  });

  it('handles processAggregationError actions', () => {
    const action = {
      error: { message: 'error message', name: 'messageTypeName' },
    };

    const expected = {
      ...aggState,
      error: { message: 'error message', name: 'messageTypeName' },
    };
    expect(
      target(
        {
          company: ['ab', 'cd'],
          error: '',
        },
        processAggregationError(action)
      )
    ).toEqual(expected);
  });

  it('handles processAggregationResults actions', () => {
    const action = {
      data: {
        aggregations: {
          company_response: {
            company_response: {
              buckets: [{ key: 'foo', doc_count: 99 }],
            },
          },
        },
        hits: {
          total: { value: 99 },
        },
        _meta: {
          total_record_count: 162576,
          last_updated: '2017-07-10T00:00:00.000Z',
          last_indexed: '2017-07-11T00:00:00.000Z',
          license: 'CC0',
        },
      },
    };
    const expected = {
      doc_count: 162576,
      company_response: [{ key: 'foo', doc_count: 99 }],
      isLoading: false,
      total: 99,
      error: '',
      lastUpdated: '2017-07-10T00:00:00.000Z',
      lastIndexed: '2017-07-11T00:00:00.000Z',
      hasDataIssue: undefined,
      isDataStale: undefined,
    };

    expect(
      target({ doc_count: 100 }, processAggregationResults(action))
    ).toEqual(expected);
  });
});
