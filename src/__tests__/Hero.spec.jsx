import React from 'react';
import Hero from '../Hero';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <Hero />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

