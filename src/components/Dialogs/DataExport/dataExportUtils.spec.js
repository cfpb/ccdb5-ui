import {
  buildExportFilename,
  buildMonthlyExportUrls,
  resolveExportDateRange,
  splitDateRangeByMonth,
} from './dataExportUtils';

describe('splitDateRangeByMonth', () => {
  it('splits a multi-month range with partial first and last months', () => {
    expect(splitDateRangeByMonth('2011-01-15', '2011-03-20')).toEqual([
      { from: '2011-01-15', to: '2011-01-31' },
      { from: '2011-02-01', to: '2011-02-28' },
      { from: '2011-03-01', to: '2011-03-20' },
    ]);
  });

  it('returns a single range when start and end are in the same month', () => {
    expect(splitDateRangeByMonth('2011-01-15', '2011-01-20')).toEqual([
      { from: '2011-01-15', to: '2011-01-20' },
    ]);
  });

  it('handles a range that spans a single day', () => {
    expect(splitDateRangeByMonth('2011-01-15', '2011-01-15')).toEqual([
      { from: '2011-01-15', to: '2011-01-15' },
    ]);
  });
});

describe('buildMonthlyExportUrls', () => {
  it('builds one export url per month with updated date params', () => {
    const urls = buildMonthlyExportUrls('csv', 100, {
      date_received_min: '2011-01-15',
      date_received_max: '2011-03-20',
      issue: ['foo'],
      product: ['bar'],
      searchField: 'all',
    });

    expect(urls).toHaveLength(3);
    expect(urls[0].label).toBe('1/15/2011 – 1/31/2011');
    expect(urls[0].uri).toContain('date_received_min=2011-01-15');
    expect(urls[0].uri).toContain('date_received_max=2011-01-31');
    expect(urls[0].uri).toContain('format=csv');
    expect(urls[0].uri).toContain('issue=foo');
    expect(urls[0].uri).toContain('product=bar');
    expect(urls[0].uri).toContain('size=100');
    expect(urls[0].uri).toContain('no_aggs=true');
    expect(urls[0].filename).toBe('complaints_2011-01-15_to_2011-01-31.csv');
  });

  it('uses the default date range when explicit dates are missing', () => {
    const urls = buildMonthlyExportUrls('json', 100, {
      dateLastIndexed: '2020-05-05',
      searchField: 'all',
    });

    expect(urls.length).toBeGreaterThan(0);
    expect(urls[0].uri).toContain('date_received_min=2017-05-05');
    expect(urls[0].uri).toContain('date_received_max=2017-05-31');
    expect(urls[0].filename).toBe('complaints_2017-05-05_to_2017-05-31.json');
  });

  it('falls back to a date range when state has no dates', () => {
    const urls = buildMonthlyExportUrls('csv', 100, {});

    expect(urls.length).toBeGreaterThan(0);
    expect(urls[0].filename).toMatch(/^complaints_\d{4}-\d{2}-\d{2}_to_\d{4}-\d{2}-\d{2}\.csv$/);
  });
});

describe('resolveExportDateRange', () => {
  it('prefers explicit dates from state', () => {
    expect(
      resolveExportDateRange({
        date_received_min: '2011-01-15',
        date_received_max: '2011-03-20',
      }),
    ).toEqual({
      dateMin: '2011-01-15',
      dateMax: '2011-03-20',
    });
  });

  it('falls back to the default three-year range', () => {
    expect(
      resolveExportDateRange({
        dateLastIndexed: '2020-05-05',
      }),
    ).toEqual({
      dateMin: '2017-05-05',
      dateMax: '2020-05-05',
    });
  });
});

describe('buildExportFilename', () => {
  it('builds a csv filename with the date range', () => {
    expect(buildExportFilename('csv', '2011-01-15', '2011-01-31')).toBe(
      'complaints_2011-01-15_to_2011-01-31.csv',
    );
  });
});
