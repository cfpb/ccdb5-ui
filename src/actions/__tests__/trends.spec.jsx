import { REQUERY_ALWAYS, REQUERY_NEVER } from '../../constants'
import * as sut from '../trends'

describe( 'action:trendsActions', () => {
  describe( 'changeChartType', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.CHART_TYPE_CHANGED,
        chartType: 'bar',
        requery: REQUERY_NEVER
      }
      expect( sut.changeChartType( 'bar' ) ).toEqual( expectedAction )
    } )
  } )

  describe( 'changeDataLens', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.DATA_LENS_CHANGED,
        lens: 'bar',
        requery: REQUERY_ALWAYS
      }
      expect( sut.changeDataLens( 'bar' ) ).toEqual( expectedAction )
    } )
  } )

  describe( 'changeDataSubLens', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.DATA_SUBLENS_CHANGED,
        subLens: 'bar',
        requery: REQUERY_ALWAYS
      }
      expect( sut.changeDataSubLens( 'bar' ) ).toEqual( expectedAction )
    } )
  } )

  describe( 'changeDepth', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.DEPTH_CHANGED,
        depth: 1000,
        requery: REQUERY_ALWAYS
      }
      expect( sut.changeDepth( 1000 ) ).toEqual( expectedAction )
    } )
  } )

  describe( 'resetDepth', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.DEPTH_RESET,
        requery: REQUERY_ALWAYS
      }
      expect( sut.resetDepth() ).toEqual( expectedAction )
    } )
  } )

  describe( 'changeFocus', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.FOCUS_CHANGED,
        focus: 'bar',
        requery: REQUERY_ALWAYS
      }
      expect( sut.changeFocus( 'bar' ) ).toEqual( expectedAction )
    } )
  } )

  describe( 'updateTooltip', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.TRENDS_TOOLTIP_CHANGED,
        value: 'bar',
        requery: REQUERY_NEVER
      }
      expect( sut.updateTrendsTooltip( 'bar' ) ).toEqual( expectedAction )
    } )
  } )

  describe( 'toggleTrend', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.TREND_TOGGLED,
        value: 'bar',
        requery: REQUERY_NEVER
      }
      expect( sut.toggleTrend( 'bar' ) ).toEqual( expectedAction )
    } )
  } )

} )
