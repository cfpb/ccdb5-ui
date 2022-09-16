import configureMockStore from 'redux-mock-store';
import { DateRanges } from '../DateRanges';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import * as types from '../../../constants';
import thunk from 'redux-thunk';

function setupSnapshot() {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      dateRange: '3y',
      tab: types.MODE_MAP,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <DateRanges />
    </Provider>
  );
}

describe('component: DateRanges', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot();
      let tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // TODO: reimplement when we replace enzyme with testing-library
  // describe('buttons', () => {
  //   let cb = null
  //   let target = null
  //
  //   beforeEach( () => {
  //     cb = jest.fn()
  //   } )
  //
  //   it( 'toggleDateRange is called the button is clicked', () => {
  //     target = setupEnzyme( cb, 'All' )
  //     const prev = target.find( '.date-ranges .range-3m' )
  //     prev.simulate( 'click' )
  //     expect( cb ).toHaveBeenCalledWith( '3m', 'foo' )
  //   } )
  //
  //   it( 'toggleDateRange is NOT called when the value is same', () => {
  //     target = setupEnzyme( cb, '3m' )
  //     const prev = target.find( '.date-ranges .range-3m' )
  //     prev.simulate( 'click' )
  //     expect( cb ).not.toHaveBeenCalled()
  //   } )
  // })
});
