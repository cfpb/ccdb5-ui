import target from '../aggs'
import * as types from '../../constants'

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});
    expect(actual.timely_response.length).toEqual(2)
  })

  it('handles COMPLAINTS_RECEIVED actions', () => {
    const action = {
      type: types.COMPLAINTS_RECEIVED
    }
    const state = {
    }

    expect(target(state, action)).toEqual({
    })
  })
})