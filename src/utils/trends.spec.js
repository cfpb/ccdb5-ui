import * as sut from './trends';

// ----------------------------------------------------------------------------
// Tests
describe('getSubLens', () => {
  it('returns empty string for no lens selected', () => {
    const res = sut.getSubLens('');
    expect(res).toBe('');
  });

  it('returns sublens for Company select', () => {
    const res = sut.getSubLens('Company');
    expect(res).toBe('product');
  });

  it('returns sublens for anything else select', () => {
    const res = sut.getSubLens('Foo');
    expect(res).toBe('sub_foo');
  });
});
describe('showCompanyOverLay', () => {
  it('hides overlay when it is loading', () => {
    const res = sut.showCompanyOverLay('Company', ['foo', 'nar'], true);
    expect(res).toBeFalsy();
  });

  it('shows overlay when it is Company and no filters', () => {
    const res = sut.showCompanyOverLay('Company', [], false);
    expect(res).toBeTruthy();
  });

  it('shows overlay when it is Company and null filters', () => {
    const res = sut.showCompanyOverLay('Company', null, false);
    expect(res).toBeTruthy();
  });
});

describe('pruneOther', () => {
  it('return original array if Other has values', () => {
    const buckets = [
      { name: 'Other', value: 100, date: '2012/01/01' },
      { name: 'Other', value: 0, date: '2012/02/01' },
      { name: 'Other', value: 100, date: '2012/03/01' },
      { name: 'Foo', value: 10, date: '2012/01/01' },
      { name: 'Foo', value: 120, date: '2012/02/01' },
      { name: 'Foo', value: 10, date: '2012/03/01' },
      { name: 'Bar', value: 100, date: '2012/01/01' },
      { name: 'Bar', value: 100, date: '2012/02/01' },
      { name: 'Bar', value: 100, date: '2012/03/01' },
    ];
    const res = sut.pruneOther(buckets);
    expect(res).toEqual(buckets);
  });

  it('removes Other if they are zero values', () => {
    const buckets = [
      { name: 'Other', value: 0, date: '2012/01/01' },
      { name: 'Other', value: 0, date: '2012/02/01' },
      { name: 'Other', value: 0, date: '2012/03/01' },
      { name: 'Foo', value: 10, date: '2012/01/01' },
      { name: 'Foo', value: 120, date: '2012/02/01' },
      { name: 'Foo', value: 10, date: '2012/03/01' },
      { name: 'Bar', value: 100, date: '2012/01/01' },
      { name: 'Bar', value: 100, date: '2012/02/01' },
      { name: 'Bar', value: 100, date: '2012/03/01' },
    ];
    const res = sut.pruneOther(buckets);
    expect(res).toEqual([
      { name: 'Foo', value: 10, date: '2012/01/01' },
      { name: 'Foo', value: 120, date: '2012/02/01' },
      { name: 'Foo', value: 10, date: '2012/03/01' },
      { name: 'Bar', value: 100, date: '2012/01/01' },
      { name: 'Bar', value: 100, date: '2012/02/01' },
      { name: 'Bar', value: 100, date: '2012/03/01' },
    ]);
  });
});

describe('scrollToFocus', () => {
  it('scrolls to the search summary', () => {
    const selectElement = document.createElement('div');
    selectElement.setAttribute('id', 'search-summary');
    selectElement.scrollIntoView = jest.fn();
    window.domNode = selectElement;
    document.body.appendChild(selectElement);

    sut.scrollToFocus();
    expect(selectElement.scrollIntoView).toHaveBeenCalled();
    document.body.removeChild(selectElement);
    jest.clearAllMocks();
  });

  it('does nothing if no element found', () => {
    const selectElement = document.createElement('div');
    selectElement.setAttribute('id', 'not-search-summary');
    selectElement.scrollIntoView = jest.fn();
    sut.scrollToFocus();
    expect(selectElement.scrollIntoView).not.toHaveBeenCalled();
  });
});
