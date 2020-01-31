import target, { defaultAggs } from '../aggs'
import {
  AGGREGATIONS_API_CALLED, AGGREGATIONS_FAILED, AGGREGATIONS_RECEIVED
} from '../../actions/complaints'

describe( 'reducer:aggs', () => {
  it( 'has a default state', () => {
    const actual = target( undefined, {} )

    expect( actual ).toEqual( defaultAggs )
  } )

  it( 'handles AGGREGATIONS_API_CALLED actions', () => {
    const action = {
      type: AGGREGATIONS_API_CALLED,
      url: 'foobar'
    }

    expect( target( {}, action ) ).toEqual( {
      activeCall: 'foobar',
      isLoading: true
    } )
  } )

  it( 'handles AGGREGATIONS_FAILED actions', () => {
    const action = {
      type: AGGREGATIONS_FAILED,
      error: 'error message'
    }

    const expected = {
      ...defaultAggs,
      error: 'error message'
    }
    expect( target( {
      company: ['ab', 'cd'],
      error: ''
    }, action ) ).toEqual( expected )
  } )


  it( 'handles AGGREGATIONS_RECEIVED actions', () => {
    const action = {
      type: AGGREGATIONS_RECEIVED,
      data: {
        aggregations: {
          'company_response': {
            'company_response': {
              buckets: [
                { key: 'foo', doc_count: 99 }
              ]
            }
          }
        }
      }
    }
    const expected = {
      company_response: [
        { key: 'foo', doc_count: 99 }
      ],
      isLoading: false
    }

    expect( target( {}, action ) ).toEqual( expected )
  } )


} )
