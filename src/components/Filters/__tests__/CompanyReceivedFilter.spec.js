import { CompanyReceivedFilter } from '../CompanyReceivedFilter';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

/**
 *
 * @param {object} query - Query state
 * @returns {Function} - Rendering function
 */
function setupSnapshot(query) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: query,
  });

  return renderer.create(
    <Provider store={store}>
      <CompanyReceivedFilter />
    </Provider>,
  );
}

describe('component::CompanyReceivedFilter', () => {
  describe('snapshot', () => {
    it('supports no dates in the Redux Store', () => {
      const target = setupSnapshot({});
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('shows errors', () => {
      const target = setupSnapshot({
        company_received_min: new Date(2016, 0, 1),
        company_received_max: new Date(2000, 0, 1),
      });
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
