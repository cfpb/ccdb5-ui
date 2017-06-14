import React from 'react';
import ActionBar from '../ActionBar';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <ActionBar />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

