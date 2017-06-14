import React from 'react';
import SingleCheckbox from '../SingleCheckbox';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <SingleCheckbox title="foo" label="bar" />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

