import * as sut from './filters';
import { slugify } from './index';

// ----------------------------------------------------------------------------
// Tests
describe('formatPillPrefix', () => {
  it('handles empty value', () => {
    expect(sut.formatPillPrefix()).toBe('');
    expect(sut.formatPillPrefix(null)).toBe('');
    expect(sut.formatPillPrefix(false)).toBe('');
  });

  it('formats Timely filter names', () => {
    const res = sut.formatPillPrefix('timely');
    expect(res).toBe('Timely: ');
  });

  it('ignores other filter names', () => {
    const res = sut.formatPillPrefix('zip_code');
    expect(res).toBe('');
  });
});
describe('getUpdatedFilters', () => {
  it('skips filters not in filterPatch list', () => {
    const aggs = [];
    const filterName = 'TX';
    const filters = ['a', 'b', 'c'];
    const fieldName = 'foo';
    const res = sut.getUpdatedFilters(filterName, filters, aggs, fieldName);
    expect(res).toEqual(['a', 'b', 'c']);
  });

  it('removes parent and adds sibling filters', () => {
    const aggs = [
      {
        key: 'a',
        'sub_issue.raw': {
          buckets: [{ key: 'b' }, { key: 'c' }],
        },
      },
    ];
    const filterName = slugify('a', 'b');
    const filters = ['a', 'b', 'c'];
    const fieldName = 'issue';
    const res = sut.getUpdatedFilters(filterName, filters, aggs, fieldName);
    expect(res).toEqual(['b', 'c', slugify('a', 'c')]);
  });

  it('handles parent with no child', () => {
    const aggs = [
      {
        key: 'a',
        'sub_issue.raw': {
          buckets: [],
        },
      },
    ];
    const filterName = 'a';
    const filters = ['a', 'b', 'c'];
    const fieldName = 'issue';
    const res = sut.getUpdatedFilters(filterName, filters, aggs, fieldName);
    expect(res).toEqual(['b', 'c']);
  });
});
