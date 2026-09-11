import * as sut from './format-date';

// ----------------------------------------------------------------------------
// Tests

describe('formatDate', function () {
  it('converts a string to pretty date format', function () {
    const actual = sut.formatDate('Dec 12, 1980');
    expect(actual).toBe('1980-12-12');
  });

  it('converts a date object', function () {
    const actual = sut.formatDate(new Date('January 12, 1980'));
    expect(actual).toBe('1980-01-12');
  });

  it('converts string to data model', function () {
    const actual = sut.formatDateModel(new Date('January 12, 1980'));
    expect(actual).toBe('1980-01-12');
  });

  it('converts string to natural long date', function () {
    const actual = sut.formatNaturalDate(new Date('July 13, 2026'));
    expect(actual).toBe('July 13, 2026');
  });

  it.each([
    ['January 10, 2026', 'Jan. 10, 2026'],
    ['February 10, 2026', 'Feb. 10, 2026'],
    ['March 10, 2026', 'March 10, 2026'],
    ['April 10, 2026', 'April 10, 2026'],
    ['May 10, 2026', 'May 10, 2026'],
    ['June 10, 2026', 'June 10, 2026'],
    ['July 10, 2026', 'July 10, 2026'],
    ['August 10, 2026', 'Aug. 10, 2026'],
    ['September 10, 2026', 'Sept. 10, 2026'],
    ['October 10, 2026', 'Oct. 10, 2026'],
    ['November 10, 2026', 'Nov. 10, 2026'],
    ['December 10, 2026', 'Dec. 10, 2026'],
  ])('uses CFPB month abbreviations for %s', (input, expected) => {
    expect(sut.formatNaturalDate(new Date(input))).toBe(expected);
  });
});
