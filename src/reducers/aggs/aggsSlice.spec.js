import target, {
  aggregationsApiCalled,
  aggsState,
  aggregationsApiFailed,
  aggregationsReceived,
} from './aggsSlice';

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});

    expect(actual).toEqual(aggsState);
  });

  it('handles aggregationsApiCalled actions', () => {
    const action = 'foobar';

    expect(target(aggsState, aggregationsApiCalled(action))).toEqual({
      ...aggsState,
      activeCall: 'foobar',
    });
  });

  it('handles aggregationsApiFailed actions', () => {
    const action = { message: 'error message', name: 'messageTypeName' };

    const expected = {
      ...aggsState,
      error: { message: 'error message', name: 'messageTypeName' },
    };
    expect(
      target(
        {
          ...aggsState,
          error: '',
        },
        aggregationsApiFailed(action),
      ),
    ).toEqual(expected);
  });

  it('handles aggregationsReceived actions', () => {
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
      ...aggsState,
      doc_count: 162576,
      company_response: [{ key: 'foo', doc_count: 99 }],
      total: 99,
      error: '',
      lastUpdated: '2017-07-10T00:00:00.000Z',
      lastIndexed: '2017-07-11T00:00:00.000Z',
      hasDataIssue: undefined,
      isDataStale: undefined,
    };

    expect(
      target({ ...aggsState, doc_count: 100 }, aggregationsReceived(action)),
    ).toEqual(expected);
  });
});
