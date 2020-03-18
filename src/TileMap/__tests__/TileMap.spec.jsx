import * as complaints from '../__fixtures__/complaints';
import * as sut from '..';
import TileMap from '..';

const makeChartMock = () => {
  const chartMock = {};

  const props = [
    'add',
    'addClass',
    'attr',
    'g',
    'label',
    'path',
    'rect',
    'renderer',
    'text',
    'translate',
  ];

  for ( let i = 0; i < props.length; i++ ) {
    const propName = props[ i ];
    chartMock[ propName ] = jest.fn().mockImplementation(() => (chartMock));
  }

  return chartMock;  
}

describe( 'Tile map', () => {
  const colors = [
    'rgba(247, 248, 249, 0.5)',
    'rgba(212, 231, 230, 0.5)',
    'rgba(180, 210, 209, 0.5)',
    'rgba(137, 182, 181, 0.5)',
    'rgba(86, 149, 148, 0.5)',
    'rgba(37, 116, 115, 0.5)'
  ];

  // shim this so highcharts test doesn't die
  beforeEach( () => {
    window.SVGElement.prototype.getBBox = () => ( {
      x: 0,
      y: 0
      // whatever other props you need
    } );
  } );

  afterEach( () => {
    delete window.SVGElement.prototype.getBBox;
  } );

  it( 'finds max complaints', () => {
    const state = { displayValue: 1000, name: 'Foo' };
    const result = sut.findMaxComplaints( 50, state );
    expect( result ).toEqual( 1000 );
  } );

  it( 'gets empty raw  bins', () => {
    const result = sut.getBins( [], colors );
    expect( result ).toEqual( [] );
  } );

  it( 'gets raw complaints bins', () => {
    const result = sut.getBins( complaints.raw, colors );
    expect( result )
      .toEqual( [
        {
          color: '#fff',
          from: 0,
          name: 'N/A',
          shortName: 'N/A',
          to: 1
        },
        {
          color: 'rgba(247, 248, 249, 0.5)',
          from: 1,
          name: '≥ 1',
          shortName: '≥ 1',
          to: 16435
        },
        {
          color: 'rgba(212, 231, 230, 0.5)',
          from: 16435,
          name: '≥ 16,435',
          shortName: '≥ 16K',
          to: 32868
        },
        {
          color: 'rgba(180, 210, 209, 0.5)',
          from: 32868,
          name: '≥ 32,868',
          shortName: '≥ 32K',
          to: 49302
        },
        {
          color: 'rgba(137, 182, 181, 0.5)',
          from: 49302,
          name: '≥ 49,302',
          shortName: '≥ 49K',
          to: 65735
        },
        {
          color: 'rgba(86, 149, 148, 0.5)',
          from: 65735,
          name: '≥ 65,735',
          shortName: '≥ 65K',
          to: 82169
        },
        {
          color: 'rgba(37, 116, 115, 0.5)',
          from: 82169,
          name: '≥ 82,169',
          shortName: '≥ 82K',
          // eslint-disable-next-line no-undefined
          to: undefined
        } ] );
  } );

  it( 'gets empty per capita bins', () => {
    const result = sut.getPerCapitaBins( [], colors );
    expect( result ).toEqual( [] );
  } );

  it( 'gets Per Capita bins', () => {
    const result = sut.getPerCapitaBins( complaints.perCapita, colors );
    expect( result )
      .toEqual( [
        {
          color: 'rgba(247, 248, 249, 0.5)',
          from: 0,
          name: '≥ 0',
          shortName: '≥ 0',
          to: 0.92
        },
        {
          color: 'rgba(212, 231, 230, 0.5)',
          from: 0.92,
          name: '≥ 0.92',
          shortName: '≥ 0.92',
          to: 1.84
        },
        {
          color: 'rgba(180, 210, 209, 0.5)',
          from: 1.84,
          name: '≥ 1.84',
          shortName: '≥ 1.84',
          to: 2.75
        },
        {
          color: 'rgba(137, 182, 181, 0.5)',
          from: 2.75,
          name: '≥ 2.75',
          shortName: '≥ 2.75',
          to: 3.67
        },
        {
          color: 'rgba(86, 149, 148, 0.5)',
          from: 3.67,
          name: '≥ 3.67',
          shortName: '≥ 3.67',
          to: 4.59
        },
        {
          color: 'rgba(37, 116, 115, 0.5)',
          from: 4.59,
          name: '≥ 4.59',
          shortName: '≥ 4.59',
          // eslint-disable-next-line no-undefined
          to: undefined
        } ] );
  } );

  it( 'Gets color of a tile based on bin limits', () => {
    const bins = [
      { color: 'white', from: 0 },
      { color: 'green', from: 10 },
      { color: 'red', from: 30 }
    ];
    let result = sut.getColorByValue( 23, bins );
    expect( result ).toEqual( 'green' );
    result = sut.getColorByValue( null, bins );
    expect( result ).toEqual( '#ffffff' );
  } );

  it( 'formats a map tile', () => {
    sut.point = {
      displayValue: 10000,
      name: 'FA'
    };

    const result = sut.tileFormatter();
    expect( result )
      .toEqual( '<div class="highcharts-data-label-state">' +
      '<span class="abbr">FA</span>' +
      '<span class="value">10,000</span></div>' );
  } );

  it( 'formats a map tile in Internet Explorer', () => {
    sut.point = {
      displayValue: 10000,
      name: 'FA'
    };

    Object.defineProperty( window.navigator, 'userAgent',
      { value: 'MSIE' } )

    const result = sut.tileFormatter();
    expect( result )
      .toEqual( '<div class="highcharts-data-label-state">' +
        '<span class="abbr">FA</span>' +
        '<br />' +
        '<span class="value">10,000</span></div>' );
  } );

  it( 'formats the map tooltip w/ missing data', () => {
    sut.fullName = 'Another Name';
    sut.value = 10000;
    const result = sut.tooltipFormatter();
    expect( result ).toEqual( '<div class="title">Another Name' +
      '</div><div class="row u-clearfix"><p class="u-float-left">Complaints' +
      '</p><p class="u-right">10,000</p></div>' );
  } );

  it( 'formats the map tooltip w/ prod & issue', () => {
    sut.fullName = 'State Name';
    sut.value = 10000;
    sut.perCapita = 3.12;
    sut.product = 'Expensive Item';
    sut.issue = 'Being Broke';
    const result = sut.tooltipFormatter();
    expect( result ).toEqual( '<div class="title">State Name' +
      '</div><div class="row u-clearfix"><p class="u-float-left">Complaints' +
      '</p><p class="u-right">10,000</p></div><div class="row u-clearfix">' +
      '<p class="u-float-left">Per capita</p><p class="u-right">3.12</p>' +
      '</div><div class="row u-clearfix"><p class="u-float-left">' +
      'Product with highest complaint volume</p><p class="u-right">' +
      'Expensive Item</p></div><div class="row u-clearfix">' +
      '<p class="u-float-left">Issue with highest complaint volume</p>' +
      '<p class="u-right">Being Broke</p></div>' );
  } );

  it( 'Processes the map data', () => {
    const bins = [
      {
        color: 'rgba(247, 248, 249, 0.5)',
        from: 1,
        name: '≥ 0',
        to: 16435
      },
      {
        color: 'rgba(212, 231, 230, 0.5)',
        from: 16435,
        name: '≥ 16K',
        to: 32868
      },
      {
        color: 'rgba(180, 210, 209, 0.5)',
        from: 32868,
        name: '≥ 33K',
        to: 49302
      },
      {
        color: 'rgba(137, 182, 181, 0.5)',
        from: 49302,
        name: '≥ 49K',
        to: 65735
      },
      {
        color: 'rgba(86, 149, 148, 0.5)',
        from: 65735,
        name: '≥ 66K',
        to: 82169
      },
      {
        color: 'rgba(37, 116, 115, 0.5)',
        from: 82169,
        name: '≥ 82K',
        // eslint-disable-next-line no-undefined
        to: undefined
      } ];
    const result = sut.processMapData( complaints.raw, bins );
    // test only the first one just make sure that the path and color are found
    expect( result[0] ).toEqual( {
      name: 'AK',
      fullName: 'Alaska',
      value: 713,
      issue: 'Incorrect information on your report',
      product: 'Credit reporting, credit repair services, or other personal consumer reports',
      perCapita: 0.97,
      displayValue: 713,
      color: 'rgba(247, 248, 249, 0.5)',
      path: 'M92,-245L175,-245,175,-162,92,-162,92,-245'
    } );
  } );

  describe( 'legend', () => {
    let chart;
    beforeEach( () => {
      chart = {
        options: {
          bins: [
            {
              color: 'rgba(247, 248, 249, 0.5)',
              from: 1,
              name: '≥ 0',
              shortName: '≥ 0',
              to: 16435
            },
            {
              color: 'rgba(212, 231, 230, 0.5)',
              from: 16435,
              name: '≥ 16767',
              shortName: '≥ 16K',
              to: 32868
            },
            {
              color: 'rgba(180, 210, 209, 0.5)',
              from: 32868,
              name: '≥ 33413',
              shortName: '≥ 33K',
              to: 49302
            },
            {
              color: 'rgba(137, 182, 181, 0.5)',
              from: 49302,
              name: '≥ 49874',
              shortName: '≥ 49K',
              to: 65735
            },
            {
              color: 'rgba(86, 149, 148, 0.5)',
              from: 65735,
              name: '≥ 65735',
              shortName: '≥ 65K',
              to: 82169
            },
            {
              color: 'rgba(37, 116, 115, 0.5)',
              from: 82169,
              name: '≥ 82169',
              shortName: '≥ 82K',
              // eslint-disable-next-line no-undefined
              to: undefined
            } ],
          legend: {
            legendTitle: 'Foo'
          }
        },
        margin: []
      };
    } );

    it( 'draws a large legend' , () => {
      chart.renderer = makeChartMock();
      chart.chartWidth = 900;
      sut._drawLegend( chart );
      expect( chart.renderer.add ).toHaveBeenCalledTimes( 24 );
      expect( chart.renderer.rect ).toHaveBeenCalledWith( 0, 0, 65, 17 )
      expect( chart.renderer.text ).toHaveBeenCalledWith( '≥ 82169', 0, 17 )
      expect
    } );

    it( 'draws a small legend' , () => {
      chart.renderer = makeChartMock();
      chart.chartWidth = 599;
      sut._drawLegend( chart );
      expect( chart.renderer.add ).toHaveBeenCalledTimes( 24 );
      expect( chart.renderer.rect ).toHaveBeenCalledWith( 0, 0, 45, 17 )
      expect( chart.renderer.text ).toHaveBeenCalledWith( '≥ 82K', 0, 17 )
    } );
  } );

  it( 'can construct a map', () => {
    const options = {
      el: document.createElement( 'div' ),
      data: [],
      isPerCapita: false
    };

    const drawSpy = jest.spyOn( TileMap.prototype, 'draw' );
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap( options );
    expect( drawSpy ).toHaveBeenCalled();
  } );

  it( 'can construct a narrow map', () => {
    const options = {
      el: document.createElement( 'div' ),
      data: [],
      isPerCapita: false,
      width: 400
    };

    const drawSpy = jest.spyOn( TileMap.prototype, 'draw' );
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap( options );
    expect( drawSpy ).toHaveBeenCalled();
  } );

  it( 'can construct a perCapita map', () => {
    const options = {
      el: document.createElement( 'div' ),
      data: [],
      isPerCapita: true
    };

    const drawSpy = jest.spyOn( TileMap.prototype, 'draw' );
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap( options );

    expect( drawSpy ).toHaveBeenCalled();
  } );

  it( 'shortens long numbers' , () => {
    const cases = [
      { n: 0, e: '0' },
      { n: 7, e: '7' },
      { n: 42, e: '42' },
      { n: 567, e: '567' },
      { n: 3456, e: '3.4K' },
      { n: 9873, e: '9.8K' },
      { n: 23456, e: '23K' },
      { n: 98765, e: '98K' },
      { n: 234567, e: '234K' },
      { n: 782345, e: '782K' },
      { n: 1450000, e: '1.4M' },
      { n: 9870000, e: '9.8M' },
    ]

    cases.forEach( x => {
      expect(sut.makeShortName(x.n)).toEqual(x.e);
    })
  } );

} );
