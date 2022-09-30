import { act, create } from 'react-test-renderer';
import { App, DetailComponents } from '../App';
import configureMockStore from 'redux-mock-store';
import { defaultQuery } from '../reducers/query';
// import { Provider } from 'react-redux';
import React from 'react';
import thunk from 'redux-thunk';
import 'regenerator-runtime/runtime';
import {MemoryRouter, Route, Routes} from "react-router-dom";

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
      target = create(<App />);
    });

    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: rewrite this test when we upgrade to react18 and testing-library
  xit('renders the detail route', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    // const store = mockStore({
    //   detail: { data: {}, error: '' },
    // });

    const detailTarget = create(
      <MemoryRouter initialEntries={['/detail/1234']}>
        <Routes>
          <Route path="/detail/:id" element={<DetailComponents />} />
        </Routes>
      </MemoryRouter>
    );

    const detailTree = detailTarget.toJSON();
    expect(detailTree).toMatchSnapshot();
  });
});
