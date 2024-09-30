import target, { defaultAggs } from './aggs';
import {
  AGGREGATIONS_API_CALLED,
  AGGREGATIONS_FAILED,
  AGGREGATIONS_RECEIVED,
} from '../../actions/complaints';

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});

    expect(actual).toEqual(defaultAggs);
  });

  it('handles AGGREGATIONS_API_CALLED actions', () => {
    const action = {
      type: AGGREGATIONS_API_CALLED,
      url: 'foobar',
    };

    expect(target({}, action)).toEqual({
      activeCall: 'foobar',
    });
  });

  it('handles AGGREGATIONS_FAILED actions', () => {
    const action = {
      type: AGGREGATIONS_FAILED,
      error: { message: 'error message', name: 'messageTypeName' },
    };

    const expected = {
      ...defaultAggs,
      error: { message: 'error message', name: 'messageTypeName' },
    };
    expect(
      target(
        {
          company: ['ab', 'cd'],
          error: '',
        },
        action,
      ),
    ).toEqual(expected);
  });

  it('handles AGGREGATIONS_RECEIVED actions', () => {
    const action = {
      type: AGGREGATIONS_RECEIVED,
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
      activeCall: '',
      doc_count: 162576,
      company_response: [{ key: 'foo', doc_count: 99 }],
      total: 99,
      error: '',
      lastUpdated: '2017-07-10T00:00:00.000Z',
      lastIndexed: '2017-07-11T00:00:00.000Z',
      hasDataIssue: undefined,
      isDataStale: undefined,
    };

    expect(target({ doc_count: 100 }, action)).toEqual(expected);
  });
});
