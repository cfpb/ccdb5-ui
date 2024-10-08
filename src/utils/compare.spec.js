import * as sut from './compare';

// ----------------------------------------------------------------------------
// Tests
describe('arrayEquals', () => {
  it('compares different length arrays', () => {
    const res = sut.arrayEquals([], [1, 2]);
    expect(res).toBeFalsy();
  });

  it('compares equal arrays', () => {
    const res = sut.arrayEquals([1, 2], [1, 2]);
    expect(res).toBeTruthy();
  });

  it('compares unsorted arrays', () => {
    const res = sut.arrayEquals([2, 1], [1, 2]);
    expect(res).toBeFalsy();
  });

  it('compares arrays with different values', () => {
    const res = sut.arrayEquals([2, 2], [1, 2]);
    expect(res).toBeFalsy();
  });
});

describe('isEqual', () => {
  it('compares different length arrays', () => {
    const res = sut.isEqual([], [1, 2]);
    expect(res).toBeFalsy();
  });

  it('compares equal arrays', () => {
    const res = sut.isEqual([1, 2], [1, 2]);
    expect(res).toBeTruthy();
  });

  it('compares unsorted arrays', () => {
    const res = sut.isEqual([2, 1], [1, 2]);
    expect(res).toBeFalsy();
  });

  it('compares arrays with different values', () => {
    const res = sut.isEqual([2, 2], [1, 2]);
    expect(res).toBeFalsy();
  });

  it('compares different objects', () => {
    const res = sut.isEqual({}, { foo: 1 });
    expect(res).toBeFalsy();
  });

  it('compares equal objects', () => {
    const res = sut.isEqual({ foo: 1 }, { foo: 1 });
    expect(res).toBeTruthy();
  });
});
