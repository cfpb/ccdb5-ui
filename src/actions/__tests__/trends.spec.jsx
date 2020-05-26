import { REQUERY_ALWAYS } from '../../constants'
import * as sut from '../trends'

describe('action:trendsActions', () => {
  describe('changeDataLens', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.DATA_LENS_CHANGED,
        lens: 'bar',
        requery: REQUERY_ALWAYS
      }
      expect(sut.changeDataLens('bar')).toEqual( expectedAction )
    })
  })
})
