import React from 'react';
import { App } from '../App';
import { defaultQuery } from '../reducers/query'
import renderer from 'react-test-renderer';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

describe('initial state', () => {
  it('renders without crashing', () => {
    defaultQuery.searchText = 'foo';

    const target = renderer.create(
      <App />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
