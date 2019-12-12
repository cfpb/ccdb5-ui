import { App, DetailComponents } from '../App';
import configureMockStore from 'redux-mock-store'
import { defaultQuery } from '../reducers/query'
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux'
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk'

describe('initial state', () => {
  it('renders without crashing', () => {

    // set the date so snapshot will always be the same.
    const DATE_TO_USE = new Date('2016');
    const _Date = Date;
    global.Date = jest.fn(() => DATE_TO_USE);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;
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
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
      detail: { data: {}, error: '' }
    })

    const match = { params: { id: '1234' } };
    const detailTarget = renderer.create(
      <MemoryRouter initialEntries={[ '/detail/1234' ]}>
        <Provider store={store}>
          <DetailComponents match={ match }/>
        </Provider>
      </MemoryRouter>
    );

    let detailTree = detailTarget.toJSON();
    expect(detailTree).toMatchSnapshot();
  });
});
