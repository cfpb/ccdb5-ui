import { REQUERY_ALWAYS, REQUERY_NEVER } from '../../constants'
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

  describe('changeDataSubLens', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.DATA_SUBLENS_CHANGED,
        subLens: 'bar',
        requery: REQUERY_ALWAYS
      }
      expect(sut.changeDataSubLens('bar')).toEqual( expectedAction )
    })
  })

  describe('changeFocus', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.FOCUS_CHANGED,
        focus: 'bar',
        requery: REQUERY_ALWAYS
      }
      expect(sut.changeFocus('bar')).toEqual( expectedAction )
    })
  })


  describe('updateTooltip', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.TRENDS_TOOLTIP_CHANGED,
        value: 'bar',
        requery: REQUERY_NEVER
      }
      expect(sut.updateTrendsTooltip('bar')).toEqual( expectedAction )
    })
  })

  describe('toggleTrend', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.TREND_TOGGLED,
        value: 'bar',
        requery: REQUERY_NEVER
      }
      expect(sut.toggleTrend('bar')).toEqual( expectedAction )
    })
  })

})
