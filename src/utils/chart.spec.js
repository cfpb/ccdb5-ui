import * as sut from './chart';

// ----------------------------------------------------------------------------
// Tests
describe('getLastDate', () => {
  const config = {
    dateRange: {
      from: '2012',
      to: '2016',
    },
    interval: 'Month',
    lastDate: '2020-03-01T12:00:00.000Z',
  };

  const dataSet = [
    { name: 'foo', date: '2020-01-01T12:00:00.000Z' },
    { name: 'foo', date: '2020-02-01T12:00:00.000Z' },
    { name: 'foo', date: '2020-03-01T12:00:00.000Z' },
    { name: 'bar', date: '2020-01-01T12:00:00.000Z' },
    { name: 'bar', date: '2020-02-01T12:00:00.000Z' },
    { name: 'bar', date: '2020-03-01T12:00:00.000Z' },
  ];
  it('does nothing when data is empty', () => {
    const res = sut.getLastDate([], config);
    expect(res).toBeNull();
  });
  it('retrieves the last point', () => {
    const res = sut.getLastDate(dataSet, config);
    expect(res).toEqual({
      date: '2020-03-01T12:00:00.000Z',
      dateRange: {
        from: '2012',
        to: '2016',
      },
      interval: 'Month',
      key: '2020-03-01T12:00:00.000Z',
      values: [
        { date: '2020-03-01T12:00:00.000Z', name: 'foo' },
        { date: '2020-03-01T12:00:00.000Z', name: 'bar' },
      ],
    });
  });
});

describe('getLastLineDate', () => {
  const config = {
    dateRange: {
      from: '2012',
      to: '2016',
    },
    interval: 'Month',
  };

  it('does nothing when data is empty', () => {
    const res = sut.getLastLineDate([], config);
    expect(res).toBeNull();
  });
});

describe('getTooltipTitle', () => {
  let dateRange, interval, res;
  beforeEach(() => {
    dateRange = {
      from: '2015-03-22T04:00:00.000Z',
      to: '2021-08-24T04:00:00.000Z',
    };
  });

  it('sets tooltip title - month', () => {
    interval = 'Month';
    const inDate = '2015-09-01T10:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 9/1/2015 - 9/30/2015');
    res = sut.getTooltipTitle(inDate, interval, dateRange, false);
    expect(res).toBe('9/1/2015 - 9/30/2015');
  });

  it('sets tooltip title - week', () => {
    interval = 'Week';
    const inDate = '2015-08-31T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 8/31/2015 - 9/6/2015');
    res = sut.getTooltipTitle(inDate, interval, dateRange, false);
    expect(res).toBe('8/31/2015 - 9/6/2015');
  });

  it('sets tooltip title - day', () => {
    interval = 'Day';
    const inDate = '2015-09-23T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date: 9/23/2015');
    res = sut.getTooltipTitle(inDate, interval, dateRange, false);
    expect(res).toBe('Date: 9/23/2015');
  });

  it('sets tooltip title - year', () => {
    interval = 'Year';
    const inDate = '2016-01-01T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 1/1/2016 - 12/31/2016');
  });

  it('sets tooltip title - year, odd start offset', () => {
    interval = 'Year';
    const inDate = '2015-01-01T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 3/22/2015 - 12/31/2015');
  });

  it('sets tooltip title - year, odd end offset', () => {
    interval = 'Year';
    const inDate = '2021-01-01T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 1/1/2021 - 8/24/2021');
  });

  it('sets tooltip title - quarter', () => {
    interval = 'quarter';
    const inDate = '2020-07-01T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 7/1/2020 - 9/30/2020');
  });

  it('sets tooltip title - quarter, odd start offset', () => {
    interval = 'quarter';
    dateRange.from = '2020-07-14T04:00:00.000Z';
    const inDate = '2020-07-01T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 7/14/2020 - 9/30/2020');
  });

  it('sets tooltip title - quarter, odd end offset', () => {
    interval = 'quarter';
    dateRange.to = '2020-08-24T04:00:00.000Z';
    const inDate = '2020-07-01T00:00:00.000Z';
    res = sut.getTooltipTitle(inDate, interval, dateRange, true);
    expect(res).toBe('Date range: 7/1/2020 - 8/24/2020');
  });
});

describe('getTooltipDate', () => {
  it('returns a short format of a from-to date string', () => {
    const shortDate = sut.getTooltipDate('2021-01-01T00:00:00.000Z', {
      from: '2020-12-31T00:00:00.000Z',
      to: '2021-08-23T00:00:00.000Z',
    });
    expect(shortDate).toBe('1/1/2021');
  });

  it('returns a short format of a date string', () => {
    const shortDate = sut.getTooltipDate('2021-01-01T00:00:00.000Z', {
      to: '2021-08-23T00:00:00.000Z',
    });
    expect(shortDate).toBe('1/1/2021');
  });
});

describe('getColorScheme', () => {
  it('gets color scheme - default', () => {
    const rowNames = [
      { name: 'abc' },
      { name: 'alnb' },
      { name: 'Complaints' },
    ];
    const actual = sut.getColorScheme(rowNames, false, 'Overview');
    expect(actual).toEqual(['#20aa3f', '#20aa3f', '#20aa3f']);
  });

  it('gets color scheme - provided color map and rows without parents', () => {
    const colorMap = { Complaint: '#124', abc: '#aaa', def: '#bbb' };
    const rowNames = [{ name: 'abc' }, { name: 'def' }, { name: 'Complaint' }];
    const actual = sut.getColorScheme(rowNames, colorMap, 'Overview');
    expect(actual).toEqual(['#aaa', '#bbb', '#124']);
  });

  it('gets color scheme - provided color map and rows with parents', () => {
    const colorMap = { Complaint: '#124', abc: '#aaa', def: '#bbb' };
    const rowNames = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'Complaint' },
      { name: 'Compla', parent: 'Complaint' },
      { name: 'de11f', parent: 'def' },
    ];
    const actual = sut.getColorScheme(rowNames, colorMap, 'Overview');
    expect(actual).toEqual(['#aaa', '#bbb', '#124', '#124', '#bbb']);
  });

  it('gets color scheme - provided color map w/ missing data', () => {
    const colorMap = { Complaints: '#124', abc: '#aaa', def: '#bbb' };
    const rowNames = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'xxx' },
      { name: 'Complaints' },
    ];
    const actual = sut.getColorScheme(rowNames, colorMap, 'Overview');
    expect(actual).toEqual(['#aaa', '#bbb', '#20aa3f', '#124']);
  });

  it('gets color scheme - provided color map, data lens', () => {
    const colorMap = { Complaint: '#124', abc: '#aaa', def: '#bbb' };
    const rowNames = [
      { name: 'abc' },
      { name: 'def' },
      { name: 'Complaint' },
      { name: 'efg' },
      { name: 'jkh' },
    ];
    const actual = sut.getColorScheme(rowNames, colorMap, 'Product');
    expect(actual).toEqual(['#aaa', '#bbb', '#124', '#a2a3a4', '#a2a3a4']);
  });
});

describe('processRows', () => {
  it('handles empty rows / bad data', () => {
    const res = sut.processRows(false, false);
    expect(res).toEqual({
      colorScheme: [],
      data: [],
    });
  });

  it('returns only expandedRows rows', () => {
    const rows = [
      { name: 'abc', value: 123, isParent: true },
      { name: 'def', value: 123, isParent: true },
      { name: 'Complaint', value: 123, isParent: true },
      { name: 'Compla', parent: 'Complaint', value: 123 },
      { name: 'de11f', parent: 'def', value: 123 },
    ];

    const expandedRows = [];

    const res = sut.processRows(rows, false, 'Overview', expandedRows);
    expect(res).toEqual({
      colorScheme: ['#20aa3f', '#20aa3f', '#20aa3f'],
      data: [
        { name: 'abc', value: 123, isParent: true },
        { name: 'def', value: 123, isParent: true },
        { name: 'Complaint', value: 123, isParent: true },
      ],
    });
  });
});

describe('dateOutOfStartBounds', () => {
  let actual;
  it('handles date before date', () => {
    actual = sut.dateOutOfStartBounds('01/15/2011', '02/01/2011', 'Month');
    expect(actual).toBe(true);
  });
  it('handles same date', () => {
    actual = sut.dateOutOfStartBounds('02/01/2011', '02/01/2011', 'Month');
    expect(actual).toBe(false);
  });
});

describe('dateOutOfEndBounds', () => {
  let actual;
  it('handles date inside end date', () => {
    actual = sut.dateOutOfEndBounds('02/15/2011', '02/01/2011', 'Month');
    expect(actual).toBe(true);
  });
  it('handles same date', () => {
    actual = sut.dateOutOfEndBounds('02/01/2011', '02/01/2011', 'Month');
    expect(actual).toBe(true);
  });
  it('handles same date as last', () => {
    actual = sut.dateOutOfEndBounds('01/31/2011', '01/01/2011', 'Month');
    expect(actual).toBe(false);
  });
});

describe('pruneIncompleteLineInterval', () => {
  let data, dateRange;
  beforeEach(() => {
    data = {
      dataByTopic: [
        {
          name: 'Foo',
          dates: [
            { date: '01/01/2011' },
            { date: '01/01/2012' },
            { date: '01/01/2013' },
            { date: '01/01/2014' },
          ],
        },
      ],
    };

    dateRange = { from: '01/01/2011', to: '12/31/2014' };
  });

  it('returns full set if last interval complete', () => {
    const result = sut.pruneIncompleteLineInterval(data, dateRange, 'Year');
    expect(result).toEqual({
      dataByTopic: [
        {
          name: 'Foo',
          dates: [
            { date: '01/01/2011' },
            { date: '01/01/2012' },
            { date: '01/01/2013' },
            { date: '01/01/2014' },
          ],
        },
      ],
    });
  });

  it('removes start date if start interval incomplete', () => {
    dateRange.from = '12/23/2011';
    const result = sut.pruneIncompleteLineInterval(data, dateRange, 'Year');
    expect(result).toEqual({
      dataByTopic: [
        {
          name: 'Foo',
          dates: [
            { date: '01/01/2012' },
            { date: '01/01/2013' },
            { date: '01/01/2014' },
          ],
        },
      ],
    });
  });

  it('removes last date if last interval incomplete', () => {
    dateRange.to = '12/23/2014';
    const result = sut.pruneIncompleteLineInterval(data, dateRange, 'Year');
    expect(result).toEqual({
      dataByTopic: [
        {
          name: 'Foo',
          dates: [
            { date: '01/01/2011' },
            { date: '01/01/2012' },
            { date: '01/01/2013' },
          ],
        },
      ],
    });
  });
});

describe('pruneIncompleteStackedAreaInterval', () => {
  it('returns data set if to date and last dates line up', () => {
    const data = [
      { date: '01/01/2011' },
      { date: '01/01/2012' },
      { date: '01/01/2013' },
      { date: '01/01/2014' },
    ];

    const dateRange = { from: '01/01/2011', to: '12/31/2014' };
    const res = sut.pruneIncompleteStackedAreaInterval(data, dateRange, 'Year');
    expect(res).toEqual(data);
  });

  it('removes data if to date inside of last interval', () => {
    const data = [
      { date: '01/01/2011' },
      { date: '02/01/2011' },
      { date: '03/01/2011' },
      { date: '04/01/2011' },
    ];

    const dateRange = { from: '01/01/2011', to: '04/15/2011' };
    const res = sut.pruneIncompleteStackedAreaInterval(
      data,
      dateRange,
      'Month',
    );
    expect(res).toEqual([
      { date: '01/01/2011' },
      { date: '02/01/2011' },
      { date: '03/01/2011' },
    ]);
  });
});
