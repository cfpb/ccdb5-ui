import target from '../results'
import * as types from '../../constants'

describe('reducer:results', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        items: [],
        total: 0
      })
  })

  it('handles COMPLAINTS_RECEIVED actions', () => {
    const action = {
      type: types.COMPLAINTS_RECEIVED,
      items: ['123', '456'],
    }
    expect(target({}, action)).toEqual({
      items: ['123', '456'],
      total: 2
    })
  })
})