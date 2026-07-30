import * as sut from './compare';

// ----------------------------------------------------------------------------
// Tests
describe('arrayEquals', () => {
  it('compares different length arrays', () => {
    const isRes = sut.arrayEquals([], [1, 2]);
    expect(isRes).toBeFalsy();
  });

  it('compares equal arrays', () => {
    const isRes = sut.arrayEquals([1, 2], [1, 2]);
    expect(isRes).toBeTruthy();
  });

  it('compares unsorted arrays', () => {
    const isRes = sut.arrayEquals([2, 1], [1, 2]);
    expect(isRes).toBeFalsy();
  });

  it('compares arrays with different values', () => {
    const isRes = sut.arrayEquals([2, 2], [1, 2]);
    expect(isRes).toBeFalsy();
  });
});
