import { act, create } from 'react-test-renderer';
import { App, DetailComponents } from '../App';
import configureMockStore from 'redux-mock-store';
import { defaultQuery } from '../reducers/query';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import React from 'react';
import thunk from 'redux-thunk';
import 'regenerator-runtime/runtime';

jest.mock('highcharts/modules/accessibility');
jest.mock('highcharts/highmaps');

describe('initial state', () => {
  it('renders without crashing', async () => {
    // set the date so snapshot will always be the same.
    const DATE_TO_USE = new Date('1/1/2016');
    const _Date = Date;
    global.Date = jest.fn(() => DATE_TO_USE);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;
    defaultQuery.searchText = 'foo';

    let target;
    await act(async () => {
      target = create(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
    });

    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the detail route', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const store = mockStore({
      detail: { data: {}, error: '' },
    });

    const match = { params: { id: '1234' } };
    const detailTarget = create(
      <MemoryRouter initialEntries={['/detail/1234']}>
        <Provider store={store}>
          <DetailComponents match={match} />
        </Provider>
      </MemoryRouter>
    );

    const detailTree = detailTarget.toJSON();
    expect(detailTree).toMatchSnapshot();
  });
});
