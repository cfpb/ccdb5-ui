import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  FilterPanel,
  mapDispatchToProps,
  mapStateToProps
} from '../FilterPanel'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'


function setupEnzyme() {
  const props = {
    aggs: {},
    onFilterToggle: jest.fn(),
    showButton: true,
    showFilterToggle: true,
    showFilters: false
  }

  const target = shallow(<FilterPanel {...props} />);

  return {
    props,
    target
  }
}


function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    aggs: {},
    query: {},
    view: {}
  })

  return renderer.create(
    <Provider store={store}>
      <FilterPanel />
    </Provider>
  )
}

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  });
});

describe('mapDispatchToProps', () => {
  it('hooks into onFilterToggle', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).onFilterToggle();
    expect(dispatch.mock.calls.length).toEqual(1);
  })

  it('allows the user to trigger Filter Panel', () => {
    const { target, props } = setupEnzyme()
    const button = target.find('.filter-button button');

    button.simulate('click');
    expect(props.onFilterToggle).toHaveBeenCalled();
  });
})

describe( 'mapStateToProps', () => {
  it( 'maps state and props', () => {
    const state = {
      aggs: {},
      view:{
        showFilters: true,
        width: 1000
      }
    }
    let actual = mapStateToProps( state )
    expect( actual ).toEqual( {
      aggs: {},
      showButton: false,
      showFilterToggle: false,
      showFilters: true
    } )
  } )
} )
