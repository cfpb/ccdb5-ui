import target from '../aggs'
import { AGGREGATIONS_RECEIVED } from '../../actions/complaints'

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});

    expect(actual.company).toBeDefined();
    expect(actual.company_public_response).toBeDefined();
    expect(actual.company_response).toBeDefined();
    expect(actual.consumer_consent_provided).toBeDefined();
    expect(actual.consumer_disputed).toBeDefined();
    expect(actual.issue).toBeDefined();
    expect(actual["product"]).toBeDefined();
    expect(actual.state).toBeDefined();
    expect(actual.submitted_via).toBeDefined();
    expect(actual.tag).toBeDefined();
    expect(actual.timely).toBeDefined();
    expect(actual.zip_code).toBeDefined();
  })

  it('handles AGGREGATIONS_RECEIVED actions', () => {
    const action = {
      type: AGGREGATIONS_RECEIVED,
      data: { 
        aggregations: {
          'company_response': {
            'company_response': {
              buckets: [
                {key: 'foo', doc_count: 99}
              ]
            }
          }
        }
      }
    }
    const expected = {
      company_response: [
        {key: 'foo', doc_count: 99}
      ]
    }

    expect(target({}, action)).toEqual(expected)
  })
})
