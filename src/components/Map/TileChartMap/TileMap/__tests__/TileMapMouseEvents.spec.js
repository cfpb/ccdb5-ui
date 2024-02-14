import * as d3 from 'd3';
import * as sut from '../index';

// we put this test in a separate so we don't clobber the d3 import for bin
// calculation
jest.mock('d3', () => {
  const props = ['select', 'classed'];

  const mock = {};

  for (let idx = 0; idx < props.length; idx++) {
    const propName = props[idx];
    mock[propName] = jest.fn().mockImplementation(() => {
      return mock;
    });
  }

  return mock;
});

xdescribe('Tile map: mouse events', () => {
  const sutClone = { ...sut };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles mouseout', () => {
    sutClone.name = 'fooout';
    const dSpy = jest.spyOn(d3, 'select');
    const dSpyClassed = jest.spyOn(d3, 'classed');
    sutClone.mouseoutPoint();
    expect(dSpy).toHaveBeenCalledWith('.tile-fooout');
    expect(dSpyClassed).toHaveBeenCalledWith('hover', false);
  });

  it('handles mouseover', () => {
    sutClone.name = 'fooover';
    const dSpy = jest.spyOn(d3, 'select');
    const dSpyClassed = jest.spyOn(d3, 'classed');
    sutClone.mouseoverPoint();
    expect(dSpy).toHaveBeenCalledWith('.tile-fooover');
    expect(dSpyClassed).toHaveBeenCalledWith('hover', true);
  });
});
