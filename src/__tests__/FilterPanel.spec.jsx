import React from 'react';
import FilterPanel from '../FilterPanel';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <FilterPanel />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

