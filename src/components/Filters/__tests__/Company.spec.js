import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import React from 'react';
import ReduxCompany, { mapStateToProps } from '../Company';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

const fixture = [
  { key: 'Monocle Popper Inc', doc_count: 9999 },
  { key: 'Safe-T Deposits LLC', doc_count: 999 },
  { key: 'Securitized Collateral Risk Obligations Credit Co', doc_count: 99 },
  { key: 'EZ Credit', doc_count: 9 },
];

/**
 *
 * @param {Array} initialFixture - Initial fixture array
 * @returns {Function} - Rendering function
 */
function setupSnapshot(initialFixture) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      company: ['Monocle Popper Inc'],
    },
    aggs: {
      company: initialFixture,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxCompany />
      </IntlProvider>
    </Provider>,
  );
}

describe('component::Company', () => {
  xdescribe('snapshots', () => {
    it('renders empty values without crashing', () => {
      const target = setupSnapshot();
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', () => {
      const target = setupSnapshot(fixture);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        aggs: {
          company: [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
        },
        query: {
          company: [{ key: 'a' }],
          focus: '',
          lens: '',
          queryString: '?dsaf=fdas',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        options: [
          { disabled: false, key: 'a' },
          { disabled: false, key: 'b' },
          { disabled: false, key: 'c' },
        ],
        queryString: '?dsaf=fdas',
        selections: [{ key: 'a' }],
      });
    });

    it('disables some options on Focus page', () => {
      const state = {
        aggs: {
          company: [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
        },
        query: {
          company: [{ key: 'a' }],
          focus: 'a',
          lens: 'Company',
          queryString: '?dsaf=fdas',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        options: [
          { disabled: false, key: 'a' },
          { disabled: true, key: 'b' },
          { disabled: true, key: 'c' },
        ],
        queryString: '?dsaf=fdas',
        selections: [{ key: 'a' }],
      });
    });
  });
});
