import target from '../results'
import * as types from '../../constants'

describe('reducer:results', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        items: [],
        total: 0,
        doc_count: 0
      })
  })

  it('handles COMPLAINTS_RECEIVED actions', () => {
    const action = {
      type: types.COMPLAINTS_RECEIVED,
      data: {
        hits: {
          hits: [
            { _source: '123' },
            { _source: '456' }
          ],
          total: 2,
        }
      },
    }
    expect(target({}, action)).toEqual({
      items: ['123', '456'],
      total: 2,
      doc_count: 162576
    })
  })
})