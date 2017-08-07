import target from '../results'
import * as types from '../../constants'

describe('reducer:results', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        doc_count: 0,
        error: '',
        items: [],
        total: 0
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
    expect(target({doc_count: 0, error: 'foo'}, action)).toEqual({
      doc_count: 162576,
      error: '',
      items: ['123', '456'],
      total: 2
    })
  })

  it('handles COMPLAINTS_FAILED actions', () => {
    const action = {
      type: types.COMPLAINTS_FAILED,
      error: 'foo bar'
    }
    expect(target({doc_count: 100, items: [1, 2, 3]}, action)).toEqual({
      doc_count: 0,
      error: 'foo bar',
      items: [],
      total: 0
    })
  })
})