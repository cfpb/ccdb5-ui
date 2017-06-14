import React from 'react';
import RefinePanel from '../RefinePanel';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <RefinePanel />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

