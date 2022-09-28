import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReduxFilterPanel, {
  FilterPanel,
  mapDispatchToProps,
  mapStateToProps,
} from '../Filters/FilterPanel';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

/**
 *
 */
function setupEnzyme() {
  const props = {
    onFilterToggle: jest.fn(),
    hasButton: true,
    hasFilterToggle: true,
    hasFilters: false,
  };

  const target = shallow(<FilterPanel {...props} />);

  return {
    props,
    target,
  };
}

/**
 *
 * @param view
 */
function setupSnapshot(view) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    aggs: {},
    query: {},
    view,
  });

  return renderer.create(
    <Provider store={store}>
      <ReduxFilterPanel />
    </Provider>
  );
}

describe('initial state', () => {
  let viewStore;
  beforeEach(() => {
    viewStore = {
      hasFilters: true,
      width: 1000,
    };
  });
  it('renders without crashing', () => {
    const target = setupSnapshot(viewStore);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders button at mobile width', () => {
    viewStore.width = 600;
    viewStore.hasFilters = true;
    const target = setupSnapshot(viewStore);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders filter toggle at mobile width', () => {
    viewStore.width = 600;
    viewStore.hasFilters = false;
    const target = setupSnapshot(viewStore);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('mapDispatchToProps', () => {
  it('hooks into onFilterToggle', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).onFilterToggle();
    expect(dispatch.mock.calls.length).toEqual(1);
  });

  it('allows the user to trigger Filter Panel', () => {
    const { target, props } = setupEnzyme();
    const button = target.find('.filter-button button');

    button.simulate('click');
    expect(props.onFilterToggle).toHaveBeenCalled();
  });
});

describe('mapStateToProps', () => {
  it('maps state and props', () => {
    const state = {
      view: {
        hasFilters: true,
        width: 1000,
      },
    };
    const actual = mapStateToProps(state);
    expect(actual).toEqual({
      hasButton: false,
      hasFilterToggle: false,
      hasFilters: true,
    });
  });
});
