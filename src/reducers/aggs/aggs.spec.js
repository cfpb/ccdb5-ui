import target, {
  aggregationsApiCalled,
  aggState,
  aggregationsApiFailed,
  aggregationsReceived,
} from './aggs';

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});

    expect(actual).toEqual(aggState);
  });

  it('handles aggregationsApiCalled actions', () => {
    const action = 'foobar';

    expect(target(aggState, aggregationsApiCalled(action))).toEqual({
      ...aggState,
      activeCall: 'foobar',
      isLoading: true,
    });
  });

  it('handles aggregationsApiFailed actions', () => {
    const action = { message: 'error message', name: 'messageTypeName' };

    const expected = {
      ...aggState,
      error: { message: 'error message', name: 'messageTypeName' },
    };
    expect(
      target(
        {
          ...aggState,
          error: '',
        },
        aggregationsApiFailed(action),
      ),
    ).toEqual(expected);
  });

  it('handles aggregationsReceived actions', () => {
    const action = {
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
    };
    const expected = {
      ...aggState,
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
      target({ ...aggState, doc_count: 100 }, aggregationsReceived(action)),
    ).toEqual(expected);
  });
});
