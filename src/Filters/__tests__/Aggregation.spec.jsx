import React from 'react';
import Aggregation from '../Aggregation';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    let options = [];

    const target = renderer.create(
      <Aggregation options={options} />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

