import React from 'react';
import CollapsibleFilter from '../CollapsibleFilter';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <CollapsibleFilter title="foo" desc="bar" />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

