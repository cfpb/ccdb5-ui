import { DateFilter } from '../DateFilter';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

function setupSnapshot(query) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: query,
  });

  return renderer.create(
    <Provider store={store}>
      <DateFilter
        fieldName="date_received"
        title="Date CFPB Received the complaint"
      />
    </Provider>
  );
}

describe('component::DateFilter', () => {
  describe('snapshot', () => {
    it('supports no dates in the Redux Store', () => {
      const target = setupSnapshot({});
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('shows errors', () => {
      const target = setupSnapshot({
        date_received_min: new Date(2016, 0, 1),
        date_received_max: new Date(2000, 0, 1),
      });
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('shows a warning for April 2017', () => {
      const target = setupSnapshot({
        date_received_min: new Date(2016, 0, 1),
        date_received_max: new Date(2018, 0, 1),
      });
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
