import { changePage } from '../paging'
import * as types from '../../constants'

describe('action:paging', () => {
  describe('changePage', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.PAGE_CHANGED,
          page: 99
        }
        expect(changePage(99)).toEqual(expectedAction)
    })
  })
})
