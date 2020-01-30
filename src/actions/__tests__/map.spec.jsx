import * as sut from '../map'
import { REQUERY_ALWAYS } from '../../constants'

describe('action:map', () => {
  describe('addStateFilter', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_FILTER_ADDED,
        selectedState: { abbr: 'TX', name: 'Texas'},
        requery: REQUERY_ALWAYS
      }
      const action = sut
        .addStateFilter({ abbr: 'TX', name: 'Texas'})
      expect(action).toEqual(expectedAction)
    })
  })

  describe('removeStateFilter', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_FILTER_REMOVED,
        stateAbbr: 'FO',
        requery: REQUERY_ALWAYS
      }
      expect(sut.removeStateFilter('FO')).toEqual(expectedAction)
    })
  })

  describe('showStateComplaints', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_COMPLAINTS_SHOWN,
        stateAbbr: 'FO',
        requery: REQUERY_ALWAYS
      }
      expect(sut.showStateComplaints('FO')).toEqual(expectedAction)
    })
  })
})
