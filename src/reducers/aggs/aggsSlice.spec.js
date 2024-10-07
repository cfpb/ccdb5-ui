import target, {
  aggregationsApiCalled,
  defaultAggs,
  aggregationsApiFailed,
  aggregationsReceived,
} from './aggsSlice';

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});

    expect(actual).toEqual(defaultAggs);
  });

  it('handles aggregationsApiCalled actions', () => {
    const url = 'foobar';

    expect(target(defaultAggs, aggregationsApiCalled(url))).toEqual({
      ...defaultAggs,
      activeCall: 'foobar',
    });
  });

  it('handles aggregationsApiFailed actions', () => {
    const payload = { message: 'error message', name: 'messageTypeName' };

    const expected = {
      ...defaultAggs,
      error: { message: 'error message', name: 'messageTypeName' },
    };
    expect(
      target(
        {
          ...defaultAggs,
          error: '',
        },
        aggregationsApiFailed(payload),
      ),
    ).toEqual(expected);
  });

  it('handles aggregationsReceived actions', () => {
    const payload = {
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
      ...defaultAggs,
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
      target({ ...defaultAggs, doc_count: 100 }, aggregationsReceived(payload)),
    ).toEqual(expected);
  });
});
