import AggregationItem from '../AggregationItem';
import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import MoreOrLess from '../MoreOrLess';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';

const fixture = [
  { key: 'alpha', doc_count: 99 },
  { key: 'beta', doc_count: 99 },
  { key: 'gamma', doc_count: 99 },
  { key: 'delta', doc_count: 99 },
  { key: 'epsilon', doc_count: 99 },
  { key: 'zeta', doc_count: 99 },
  { key: 'eta', doc_count: 99 },
  { key: 'theta', doc_count: 99 },
];

/**
 *
 * @param initial
 */
function setupEnzyme(initial) {
  const props = {
    listComponent: AggregationItem,
    options: initial,
  };

  const target = shallow(<MoreOrLess {...props} />);
  return {
    props,
    target,
  };
}

/**
 *
 * @param hasMore
 */
function setupSnapshot(hasMore) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {},
  });
  const props = {
    hasMore,
    listComponent: AggregationItem,
    listComponentProps: { fieldName: 'myfield' },
    options: fixture,
  };

  return renderer.create(
    <Provider locale="en" store={store}>
      <IntlProvider locale="en">
        <MoreOrLess {...props} />
      </IntlProvider>
    </Provider>
  );
}

describe('component:MoreOrLess', () => {
  it('expects showAll to start false and toggle all bool states', () => {
    const { target } = setupEnzyme(fixture);
    // Initial state should be false
    expect(target.state().hasMore).toEqual(false);
    target.instance()._toggleShowMore();
    expect(target.state().hasMore).toEqual(true);
    target.instance()._toggleShowMore();
    expect(target.state().hasMore).toEqual(false);
  });

  it('matches - Show NN less', () => {
    const res = setupSnapshot(true);
    expect(res).toMatchSnapshot();
  });

  it('matches + Show NN more', () => {
    const res = setupSnapshot(false);
    expect(res).toMatchSnapshot();
  });
});
