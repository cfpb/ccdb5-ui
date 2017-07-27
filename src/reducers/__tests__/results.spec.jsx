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
        },
        '_meta': {
          total_record_count: 162576,
          last_updated: '2017-07-10T00:00:00.000Z',
          license: 'CC0'
        }
      }
    }
    expect(target({doc_count: 0}, action)).toEqual({
      items: ['123', '456'],
      total: 2,
      doc_count: 162576
    })
  })
})