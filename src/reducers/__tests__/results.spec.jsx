import target from '../results'
import * as types from '../../constants'

describe('reducer:results', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        activeCall: '',
        doc_count: 0,
        error: '',
        lastUpdated: null,
        lastIndexed: null,
        hasDataIssue: false,
        isDataStale: false,
        isNarrativeStale: false,
        isLoading: false,
        items: [],
        total: 0
      })
  })

  describe('handles API_CALLED actions', () => {
    const action = {
      type: types.API_CALLED,
      url: 'http://www.example.org'
    }
    expect(target({}, action)).toEqual({
      activeCall: 'http://www.example.org',
      isLoading: true
    })
  })

  describe('handles COMPLAINTS_RECEIVED actions', () => {
    let action

    beforeEach(() => {
      action = {
        type: types.COMPLAINTS_RECEIVED,
        data: {
          hits: {
            hits: [
              { _source: { a: '123' } },
              { _source: { a: '456' } }
            ],
            total: 2,
          },
          '_meta': {
            total_record_count: 162576,
            last_updated: '2017-07-10T00:00:00.000Z',
            last_indexed: '2017-07-11T00:00:00.000Z',
            license: 'CC0'
          }
        }
      }
    })

    it('extracts the important data from inside the returned data', () => {
      expect(target({doc_count: 0, error: 'foo'}, action)).toEqual({
        activeCall: '',
        doc_count: 162576,
        error: '',
        lastUpdated: '2017-07-10T00:00:00.000Z',
        lastIndexed: '2017-07-11T00:00:00.000Z',
        hasDataIssue: undefined,
        isDataStale: undefined,
        isLoading: false,
        items: [
          { a: '123' },
          { a: '456' }
        ],
        total: 2
      })
    })

    it('replaces text with highlighted text if it exists', () => {
      action.data.hits.hits[0].highlight = { a: [ '<em>123</em>' ] }

      expect(target({doc_count: 0, error: 'foo'}, action)).toEqual({
        activeCall: '',
        doc_count: 162576,
        error: '',
        lastUpdated: '2017-07-10T00:00:00.000Z',
        lastIndexed: '2017-07-11T00:00:00.000Z',
        hasDataIssue: undefined,
        isDataStale: undefined,
        isLoading: false,
        items: [
          { a: '<em>123</em>' },
          { a: '456' }
        ],
        total: 2
      })
    })
  })

  it('handles COMPLAINTS_FAILED actions', () => {
    const action = {
      type: types.COMPLAINTS_FAILED,
      error: 'foo bar'
    }
    expect(target({doc_count: 100, items: [1, 2, 3]}, action)).toEqual({
      activeCall: '',
      doc_count: 0,
      error: 'foo bar',
      lastUpdated: null,
      lastIndexed: null,
      hasDataIssue: false,
      isDataStale: false,
      isNarrativeStale: false,
      isLoading: false,
      items: [],
      total: 0
    })
  })
})
