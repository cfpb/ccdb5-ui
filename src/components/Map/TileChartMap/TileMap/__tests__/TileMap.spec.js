import * as complaints from '../__fixtures__/complaints';
import * as sut from '../index';
import TileMap from '../index';

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

  for (let idx = 0; idx < props.length; idx++) {
    const propName = props[idx];
    chartMock[propName] = jest.fn().mockImplementation(() => chartMock);
  }

  return chartMock;
};

describe('Tile map', () => {
  const sutClone = { ...sut };

  const colors = [
    'rgba(247, 248, 249, 0.5)',
    'rgba(212, 231, 230, 0.5)',
    'rgba(180, 210, 209, 0.5)',
    'rgba(137, 182, 181, 0.5)',
    'rgba(86, 149, 148, 0.5)',
    'rgba(37, 116, 115, 0.5)',
  ];

  // shim this so highcharts test doesn't die
  beforeEach(() => {
    window.SVGElement.prototype.getBBox = () => ({
      // eslint-disable-next-line id-length
      x: 0,
      // eslint-disable-next-line id-length
      y: 0,
      // whatever other props you need
    });
  });

  afterEach(() => {
    delete window.SVGElement.prototype.getBBox;
  });

  describe('makeScale', () => {
    it('creates an evenly-spaced scale for a exponential dataset', () => {
      const data = [];
      for (let idx = 1; idx <= 50; idx++) {
        data.push({ displayValue: idx * idx });
      }

      const actual = sutClone.makeScale(data, colors);
      expect(actual(0)).toBe('#ffffff');
      expect(actual(100)).toBe(colors[0]);
      expect(actual(361)).toBe(colors[1]); // 19^2
      expect(actual(784)).toBe(colors[2]); // 28^2
      expect(actual(1225)).toBe(colors[3]); // 35^2
      expect(actual(1681)).toBe(colors[4]); // 41^2
      expect(actual(2500)).toBe(colors[5]);
    });

    it('scales differently if there are few unique values', () => {
      const data = [];
      for (let idx = 0; idx < 51; idx++) {
        data.push({ displayValue: 0 });
      }
      data[3].displayValue = 900;

      const actual = sutClone.makeScale(data, colors);
      expect(actual(0)).toBe('#ffffff');
      expect(actual(300)).toBe(colors[1]);
      expect(actual(450)).toEqual(colors[2]);
      expect(actual(790)).toEqual(colors[5]);
    });
  });

  describe('generating bins', () => {
    let scaleFn;
    beforeEach(() => {
      scaleFn = jest.fn((val) => val);
    });

    it('gets complaints bins - All', () => {
      const quantiles = [
        880.2857142857142, 1622.5714285714282, 3064.9999999999995,
        6136.714285714284, 7788.142857142858, 13909.714285714286,
      ];
      const expected = [
        { from: 0, color: '#ffffff', name: '≥ 0', shortName: '≥ 0' },
        { from: 880, color: 881, name: '> 880', shortName: '> 880' },
        { from: 1623, color: 1623, name: '≥ 1,623', shortName: '≥ 1.6K' },
        { from: 3065, color: 3065, name: '≥ 3,065', shortName: '≥ 3.0K' },
        { from: 6137, color: 6137, name: '≥ 6,137', shortName: '≥ 6.1K' },
        { from: 7788, color: 7789, name: '> 7,788', shortName: '> 7.7K' },
        { from: 13910, color: 13910, name: '≥ 13,910', shortName: '≥ 13K' },
      ];

      const result = sutClone.getBins(quantiles, scaleFn);
      expect(result).toEqual(expected);
    });

    it('gets complaints bins - one zip code', () => {
      const quantiles = [
        0.2857142857142857, 0.5714285714285714, 0.8571428571428571,
        183.99999999999991, 550, 915.9999999999999,
      ];
      const expected = [
        { from: 0, color: '#ffffff', name: '≥ 0', shortName: '≥ 0' },
        { from: 1, color: 1, name: '≥ 1', shortName: '≥ 1' },
        { from: 184, color: 184, name: '≥ 184', shortName: '≥ 184' },
        { from: 550, color: 550, name: '≥ 550', shortName: '≥ 550' },
        { from: 916, color: 916, name: '≥ 916', shortName: '≥ 916' },
      ];

      const result = sutClone.getBins(quantiles, scaleFn);
      expect(result).toEqual(expected);
    });

    it('gets complaints bins - max 2 complaints', () => {
      const quantiles = [
        0.2857142857142857, 0.5714285714285714, 0.8571428571428571,
        1.1428571428571428, 1.4285714285714286, 1.7142857142857142,
      ];
      const expected = [
        { from: 0, color: '#ffffff', name: '≥ 0', shortName: '≥ 0' },
        { from: 1, color: 1, name: '≥ 1', shortName: '≥ 1' },
        { from: 2, color: 2, name: '≥ 2', shortName: '≥ 2' },
      ];

      const result = sutClone.getBins(quantiles, scaleFn);
      expect(result).toEqual(expected);
    });

    it('gets complaints bins - max 1 complaint', () => {
      const quantiles = [
        0.14285714285714285, 0.2857142857142857, 0.42857142857142855,
        0.5714285714285714, 0.7142857142857143, 0.8571428571428571,
      ];
      const expected = [
        { from: 0, color: '#ffffff', name: '≥ 0', shortName: '≥ 0' },
        { from: 1, color: 1, name: '≥ 1', shortName: '≥ 1' },
      ];

      const result = sutClone.getBins(quantiles, scaleFn);
      expect(result).toEqual(expected);
    });

    it('gets Per 1000 population bins', () => {
      const quantiles = [
        1.1928571428571428, 1.4657142857142857, 1.81, 2.0357142857142856, 2.33,
        2.845714285714285,
      ];
      const expected = [
        { from: 0, color: '#ffffff', name: '≥ 0', shortName: '≥ 0' },
        {
          from: 1.19,
          color: quantiles[0],
          name: '> 1.19',
          shortName: '> 1.19',
        },
        {
          from: 1.46,
          color: quantiles[1],
          name: '> 1.46',
          shortName: '> 1.46',
        },
        {
          from: 1.81,
          color: quantiles[2],
          name: '≥ 1.81',
          shortName: '≥ 1.81',
        },
        {
          from: 2.03,
          color: quantiles[3],
          name: '> 2.03',
          shortName: '> 2.03',
        },
        {
          from: 2.33,
          color: quantiles[4],
          name: '≥ 2.33',
          shortName: '≥ 2.33',
        },
        {
          from: 2.84,
          color: quantiles[5],
          name: '> 2.84',
          shortName: '> 2.84',
        },
      ];

      const result = sutClone.getPerCapitaBins(quantiles, scaleFn);
      expect(result).toEqual(expected);
    });
  });

  describe('getColorByValue', () => {
    let scaleFn;
    beforeEach(() => {
      scaleFn = jest.fn((val) => val);
    });

    it('returns WHITE when no value', () => {
      const res = sutClone.getColorByValue(false, scaleFn);
      expect(res).toBe('#ffffff');
    });
  });

  it('formats a map tile', () => {
    sutClone.point = {
      className: 'default',
      displayValue: 10000,
      name: 'FA',
    };

    const result = sutClone.tileFormatter();
    expect(result).toEqual(
      '<div class="highcharts-data-label-state tile-FA default ">' +
        '<span class="abbr">FA</span>' +
        '<span class="value">10,000</span></div>',
    );
  });

  it('formats the map tooltip w/ missing data', () => {
    sutClone.fullName = 'Another Name';
    sutClone.value = 10000;
    const result = sutClone.tooltipFormatter();
    expect(result).toEqual(
      '<div class="title">Another Name' +
        '</div><div class="row u-clearfix"><p class="u-float-left">Complaints' +
        '</p><p class="u-right">10,000</p></div>',
    );
  });

  it('formats the map tooltip w/ prod & issue', () => {
    sutClone.fullName = 'State Name';
    sutClone.value = 10000;
    sutClone.perCapita = 3.12;
    sutClone.product = 'Expensive Item';
    sutClone.issue = 'Being Broke';
    const result = sutClone.tooltipFormatter();
    expect(result).toEqual(
      '<div class="title">State Name' +
        '</div><div class="row u-clearfix"><p class="u-float-left">Complaints' +
        '</p><p class="u-right">10,000</p></div><div class="row u-clearfix">' +
        '<p class="u-float-left">Per 1000 population</p><p class="u-right">3.12</p>' +
        '</div><div class="row u-clearfix"><p class="u-float-left">' +
        'Product with highest complaint volume</p><p class="u-right">' +
        'Expensive Item</p></div><div class="row u-clearfix">' +
        '<p class="u-float-left">Issue with highest complaint volume</p>' +
        '<p class="u-right">Being Broke</p></div>',
    );
  });

  it('formats a series point for voice-over reading', () => {
    const point = {
      fullName: 'Foo',
      displayValue: '13',
    };
    const actual = sutClone.descriptionFormatter(point);
    expect(actual).toBe('Foo 13');
  });

  it('Processes the map data', () => {
    const scale = jest.fn().mockReturnValue('rgba(247, 248, 249, 1)');

    const result = sutClone.processMapData(complaints.raw, scale);
    // test only the first one just make sure that the path and color are found
    expect(result[0]).toEqual({
      className: 'default',
      name: 'AK',
      fullName: 'Alaska',
      value: 713,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
      perCapita: 0.97,
      displayValue: 713,
      color: 'rgba(247, 248, 249, 1)',
      path: 'M92,-245L175,-245,175,-162,92,-162,92,-245',
    });
    expect(result[1]).toEqual({
      className: 'deselected',
      name: 'AL',
      fullName: 'Alabama',
      value: 10380,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
      perCapita: 2.14,
      displayValue: 10380,
      color: 'rgba(247, 248, 249, 0.5)',
      path: 'M550,-337L633,-337,633,-253,550,-253,550,-337',
    });

    expect(result[2]).toEqual({
      className: 'selected',
      name: 'AR',
      fullName: 'Arkansas',
      value: 4402,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
      perCapita: 1.48,
      displayValue: 4402,
      color: 'rgba(247, 248, 249, 1)',
      path: 'M367,-428L450,-428,450,-345,367,-345,367,-428',
    });
    expect(scale).toHaveBeenCalledTimes(51);
  });

  it('Processes the map data - empty shading', () => {
    const scale = jest.fn().mockReturnValue('#ffffff');

    const result = sutClone.processMapData(complaints.raw, scale);
    // test only the first one & 3rd for path, className, color are found
    expect(result[0]).toEqual({
      className: 'empty',
      name: 'AK',
      fullName: 'Alaska',
      value: 713,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
      perCapita: 0.97,
      displayValue: 713,
      color: '#ffffff',
      path: 'M92,-245L175,-245,175,-162,92,-162,92,-245',
    });

    expect(result[2]).toEqual({
      className: 'selected',
      name: 'AR',
      fullName: 'Arkansas',
      value: 4402,
      issue: 'Incorrect information on your report',
      product:
        'Credit reporting, credit repair services, or other personal consumer reports',
      perCapita: 1.48,
      displayValue: 4402,
      color: '#ffffff',
      path: 'M367,-428L450,-428,450,-345,367,-345,367,-428',
    });
    expect(scale).toHaveBeenCalledTimes(51);
  });

  describe('legend', () => {
    let chart;
    beforeEach(() => {
      chart = {
        options: {
          bins: [
            {
              color: 'rgba(247, 248, 249, 0.5)',
              from: 1,
              name: '≥ 0',
              shortName: '≥ 0',
              to: 16435,
            },
            {
              color: 'rgba(212, 231, 230, 0.5)',
              from: 16435,
              name: '≥ 16767',
              shortName: '≥ 16K',
              to: 32868,
            },
            {
              color: 'rgba(180, 210, 209, 0.5)',
              from: 32868,
              name: '≥ 33413',
              shortName: '≥ 33K',
              to: 49302,
            },
            {
              color: 'rgba(137, 182, 181, 0.5)',
              from: 49302,
              name: '≥ 49874',
              shortName: '≥ 49K',
              to: 65735,
            },
            {
              color: 'rgba(86, 149, 148, 0.5)',
              from: 65735,
              name: '≥ 65735',
              shortName: '≥ 65K',
              to: 82169,
            },
            {
              color: 'rgba(37, 116, 115, 0.5)',
              from: 82169,
              name: '≥ 82169',
              shortName: '≥ 82K',

              to: undefined,
            },
          ],
          legend: {
            legendTitle: 'Foo',
          },
        },
        margin: [],
      };
    });

    it('draws a large legend', () => {
      chart.renderer = makeChartMock();
      chart.chartWidth = 900;
      sutClone._drawLegend(chart);
      expect(chart.renderer.add).toHaveBeenCalledTimes(24);
      expect(chart.renderer.rect).toHaveBeenCalledWith(0, 0, 65, 17);
      expect(chart.renderer.text).toHaveBeenCalledWith('≥ 82169', 0, 17);
    });

    it('draws a small legend', () => {
      chart.renderer = makeChartMock();
      chart.chartWidth = 599;
      sutClone._drawLegend(chart);
      expect(chart.renderer.add).toHaveBeenCalledTimes(24);
      expect(chart.renderer.rect).toHaveBeenCalledWith(0, 0, 45, 17);
      expect(chart.renderer.text).toHaveBeenCalledWith('≥ 82K', 0, 17);
    });
  });

  it('can construct a map', () => {
    const options = {
      el: document.createElement('div'),
      data: [],
      isPerCapita: false,
    };

    const drawSpy = jest.spyOn(TileMap.prototype, 'draw');
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap(options);
    expect(drawSpy).toHaveBeenCalled();
  });

  it('can construct a narrow map', () => {
    const options = {
      el: document.createElement('div'),
      data: [],
      isPerCapita: false,
      width: 400,
    };

    const drawSpy = jest.spyOn(TileMap.prototype, 'draw');
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap(options);
    expect(drawSpy).toHaveBeenCalled();
  });

  it('can construct a map with events', () => {
    const options = {
      el: document.createElement('div'),
      data: [],
      events: { foo: jest.fn() },
      hasTip: true,
      isPerCapita: false,
      width: 400,
    };

    const drawSpy = jest.spyOn(TileMap.prototype, 'draw');
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap(options);
    expect(drawSpy).toHaveBeenCalled();
  });

  it('can construct a perCapita map', () => {
    const options = {
      el: document.createElement('div'),
      data: [],
      isPerCapita: true,
    };

    const drawSpy = jest.spyOn(TileMap.prototype, 'draw');
    // eslint-disable-next-line no-unused-vars
    const map = new TileMap(options);

    expect(drawSpy).toHaveBeenCalled();
  });

  it('shortens long numbers', () => {
    const cases = [
      /* eslint-disable id-length */
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
    ];

    cases.forEach((x) => {
      expect(sutClone.makeShortName(x.n)).toEqual(x.e);
    });
    /* eslint-enable id-length */
  });
});
