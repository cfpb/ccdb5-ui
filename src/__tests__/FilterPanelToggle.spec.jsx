import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  FilterPanelToggle,
  mapDispatchToProps,
  mapStateToProps
} from '../components/Filters/FilterPanelToggle'
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

  const target = shallow(<FilterPanelToggle {...props} />);

  return {
    props,
    target
  }
}


function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    view: {
      showFilters: true
    }
  })

  return renderer.create(
    <Provider store={store}>
      <FilterPanelToggle />
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
    const button = target.find('button');

    button.simulate('click');
    expect(props.onFilterToggle).toHaveBeenCalled();
  });
})

describe( 'mapStateToProps', () => {
  it( 'maps state and props', () => {
    const state = {
      view:{
        showFilters: true
      }
    }
    let actual = mapStateToProps( state )
    expect( actual ).toEqual( {
      showFilters: true
    } )
  } )
} )
