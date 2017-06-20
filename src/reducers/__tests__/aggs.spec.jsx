import target from '../aggs'
import * as types from '../../constants'

describe('reducer:aggs', () => {
  it('has a default state', () => {
    const actual = target(undefined, {});
    expect(actual.timely_response.length).toEqual(2)
  })

  it('handles RCV_COMPLAINTS actions', () => {
    const action = {
      type: types.RCV_COMPLAINTS
    }
    const state = {
    }

    expect(target(state, action)).toEqual({
    })
  })
})