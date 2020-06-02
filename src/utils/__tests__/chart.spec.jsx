/* eslint-disable camelcase */
import * as sut from '../chart'

// ----------------------------------------------------------------------------
// Tests

describe( 'getTooltipTitle', () => {
  let dateRange, interval
  beforeEach( () => {
    dateRange = { from: '01/01/1970', to: '10/07/2015' }
  } )

  it( 'sets tooltip title - month', () => {
    interval = 'Month'
    const res = sut.getTooltipTitle( '09/1/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 09/01/1980 - 09/30/1980' )
  } )

  it( 'sets tooltip title - week', () => {
    interval = 'Week'
    const res = sut.getTooltipTitle( '09/1/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 09/01/1980 - 09/07/1980' )
  } )

  it( 'sets tooltip title - day', () => {
    interval = 'Day'
    const res = sut.getTooltipTitle( '09/23/1980', interval, dateRange )
    expect( res ).toEqual( 'Date: 09/23/1980' )
  } )

  it( 'sets tooltip title - year', () => {
    interval = 'Year'
    const res = sut.getTooltipTitle( '01/01/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 01/01/1980 - 12/31/1980' )
  } )

  it( 'sets tooltip title - year, odd start offset', () => {
    interval = 'Year'
    dateRange.from = '03/22/1980'
    const res = sut.getTooltipTitle( '01/01/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 03/22/1980 - 12/31/1980' )
  } )

  it( 'sets tooltip title - year, odd end offset', () => {
    interval = 'Year'
    dateRange.to = '03/22/1980'
    const res = sut.getTooltipTitle( '01/01/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 01/01/1980 - 03/22/1980' )
  } )

  it( 'sets tooltip title - quarter', () => {
    interval = 'quarter'
    const res = sut.getTooltipTitle( '07/01/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 07/01/1980 - 12/31/1980' )
  } )

  it( 'sets tooltip title - quarter, odd start offset', () => {
    interval = 'quarter'
    const res = sut.getTooltipTitle( '07/15/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 07/15/1980 - 12/31/1980' )
  } )

  it( 'sets tooltip title - quarter, odd end offset', () => {
    interval = 'quarter'
    dateRange.to = '11/10/1980'
    const res = sut.getTooltipTitle( '07/01/1980', interval, dateRange )
    expect( res ).toEqual( 'Date Interval: 07/01/1980 - 11/10/1980' )
  } )
} )

describe( 'getColorScheme', function () {
  it( 'gets color scheme - default', () => {
    const colorMap = { Complaints: '#124' }
    const rowNames = [ { name: 'abc' }, { name: 'alnb' }, { name: 'Complaints' } ]
    const actual = sut.getColorScheme( rowNames, false )
    expect( actual ).toEqual( [
      '#20aa3f', '#20aa3f', '#20aa3f'
    ] )
  } )

  it( 'gets color scheme - provided color map', () => {
    const colorMap = { Complaint: '#124', abc: '#aaa', def: '#bbb' }
    const rowNames = [ { name: 'abc' }, { name: 'def' }, { name: 'Complaint' } ]
    const actual = sut.getColorScheme( rowNames, colorMap )
    expect( actual ).toEqual( [ '#aaa', '#bbb', '#124' ] )
  } )

  it( 'gets color scheme - provided color map', () => {
    const colorMap = { Complaint: '#124', abc: '#aaa', def: '#bbb' }
    const rowNames = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'Complaint' },
      { name: 'Compla', parent: 'Complaint' },
      { name: 'de11f', parent: 'def' }
    ]
    const actual = sut.getColorScheme( rowNames, colorMap )
    expect( actual )
      .toEqual( [ '#aaa', '#bbb', '#124', '#124', '#bbb' ] )
  } )


  it( 'gets color scheme - provided color map w/ missing data', () => {
    const colorMap = { Complaints: '#124', abc: '#aaa', def: '#bbb' }
    const rowNames = [ { name: 'abc' }, { name: 'def' }, { name: 'xxx' },
      { name: 'Complaints' } ]
    const actual = sut.getColorScheme( rowNames, colorMap )
    expect( actual ).toEqual( [ '#aaa', '#bbb', '#20aa3f', '#124' ] )
  } )
} )

describe( 'processRows', () => {
  it( 'returns only visible rows', () => {
    const filters = []
    const rows = [
      { name: 'abc', visible: true, value: 123 },
      { name: 'def', visible: true, value: 123 },
      { name: 'Complaint', visible: true, value: 123 },
      { name: 'Compla', parent: 'Complaint', visible: false, value: 123 },
      { name: 'de11f', parent: 'def', visible: false, value: 123 } ]
    const res = sut.processRows( filters, rows, false )
    expect( res ).toEqual( {
      colorScheme: [ '#20aa3f', '#20aa3f', '#20aa3f' ],
      data: [
        { name: 'abc', visible: true,  value: 123 },
        { name: 'def', visible: true,  value: 123 },
        { name: 'Complaint', visible: true,  value: 123 }
      ]
    } )
  } )

  it( 'returns only filtered visible rows', () => {
    const filters = [ 'abc' ]
    const colorMap = { Complaint: '#124', abc: '#aaa', def: '#bbb' }
    const rows = [
      { name: 'abc', visible: true, value: 123 },
      { name: 'def', visible: true, value: 123 },
      { name: 'Complaint', visible: true, value: 123 },
      { name: 'Compla', parent: 'Complaint', visible: false, value: 123 },
      { name: 'de11f', parent: 'def', visible: false, value: 123 } ]
    const res = sut.processRows( filters, rows, colorMap )
    expect( res ).toEqual( {
      colorScheme: [ '#aaa' ],
      data: [
        { name: 'abc', visible: true,  value: 123 }
      ]
    } )
  } )
} )
