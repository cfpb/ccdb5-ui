import React from 'react';
import { App, DetailComponents } from '../App';
import { defaultQuery } from '../reducers/query'
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router';

describe('initial state', () => {
  it('renders without crashing', () => {
    defaultQuery.searchText = 'foo';

    const target = renderer.create(
      <MemoryRouter initialEntries={[ '/' ]}>
        <App />
      </MemoryRouter>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();

  });

  it('renders the detail route', () => {
    const match = { params: { id: '1234' } };
    const detailTarget = renderer.create(
      <MemoryRouter initialEntries={[ '/detail/1234' ]}>
        <DetailComponents match={ match }/>
      </MemoryRouter>
    );

    let detailTree = detailTarget.toJSON();
    expect(detailTree).toMatchSnapshot();
  });
});
