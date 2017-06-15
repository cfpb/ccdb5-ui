import React from 'react';
import ResultsPanel from '../ResultsPanel';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <ResultsPanel items={ [] } />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
