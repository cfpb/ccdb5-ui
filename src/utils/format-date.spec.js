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
});
