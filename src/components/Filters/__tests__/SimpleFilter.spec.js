import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { IntlProvider } from 'react-intl';
import ReduxSimpleFilter, { mapStateToProps } from '../SimpleFilter';

import renderer from 'react-test-renderer';

/**
 *
 * @param initialAggs
 */
function setupSnapshot(initialAggs) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {},
    aggs: {
      company_response: initialAggs,
      timely: 'yes',
    },
  });

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxSimpleFilter fieldName="company_response" title="nana" />
      </IntlProvider>
    </Provider>
  );
}

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot([{ key: 'foo', doc_count: 99 }]);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('mapStateToProps', () => {
  let state, ownProps;
  beforeEach(() => {
    state = {
      aggs: {
        foo: [1, 2, 3, 4, 5, 6],
      },
      query: {
        foo: [1],
      },
    };
    ownProps = {
      fieldName: 'foo',
    };
  });

  it('shows if there are any active children', () => {
    const actual = mapStateToProps(state, ownProps);
    expect(actual).toEqual({
      options: [1, 2, 3, 4, 5, 6],
      hasChildren: true,
    });
  });

  it('hides if there are no active children', () => {
    state.query.foo = [];

    const actual = mapStateToProps(state, ownProps);
    expect(actual).toEqual({
      options: [1, 2, 3, 4, 5, 6],
      hasChildren: false,
    });
  });
});
