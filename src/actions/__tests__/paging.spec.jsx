import { REQUERY_HITS_ONLY } from '../../constants'
import * as sut from '../paging'

describe('action:paging', () => {
  describe('changePage', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: sut.PAGE_CHANGED,
          page: 99,
          requery: REQUERY_HITS_ONLY
        }
        expect(sut.changePage(99)).toEqual(expectedAction)
    })
  })

  describe('changeSize', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: sut.SIZE_CHANGED,
          size: 50,
          requery: REQUERY_HITS_ONLY
        }
        expect(sut.changeSize(50)).toEqual(expectedAction)
    })
  })

  describe('prevPageShown', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.PREV_PAGE_SHOWN,
        requery: REQUERY_HITS_ONLY
      }
      expect(sut.prevPageShown()).toEqual(expectedAction)
    })
  })


})