import configureMockStore from 'redux-mock-store';
import ReduxMapToolbar, {
  mapDispatchToProps,
  mapStateToProps,
  MapToolbar,
} from '../Map/MapToolbar';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';

/**
 *
 */
function setupEnzyme() {
  const props = {
    clearStates: jest.fn(),
    filteredStates: 'Texas',
    showComplaints: jest.fn(),
  };

  const target = shallow(<MapToolbar {...props} />);

  return {
    props,
    target,
  };
}

/**
 *
 * @param filteredStates
 */
function setupSnapshot(filteredStates) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      state: filteredStates,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <ReduxMapToolbar />
    </Provider>
  );
}

describe('component: MapToolbar', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot([]);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders filtered states without crashing', () => {
      const target = setupSnapshot(['FL', 'TX']);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('mapDispatchToProps', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('provides a way to call clearStates', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).clearStates();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
    it('provides a way to call showComplaints', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).showComplaints();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          state: ['LA', 'MS', 'ZZ'],
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        filteredStates: 'Louisiana, Mississippi',
      });
    });
  });

  describe('click actions', () => {
    it('allows the user to remove state filter', () => {
      const { target, props } = setupEnzyme();
      const button = target.find('a.clear');

      button.simulate('click');
      expect(props.clearStates).toHaveBeenCalled();
    });
    it('allows the user to view complaints by state', () => {
      const { target, props } = setupEnzyme();
      const button = target.find('a.list');

      button.simulate('click');
      expect(props.showComplaints).toHaveBeenCalled();
    });
  });
});
