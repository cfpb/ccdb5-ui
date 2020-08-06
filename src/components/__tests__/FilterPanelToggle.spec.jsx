import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxFilterPanelToggle, {
  FilterPanelToggle,
  mapDispatchToProps,
  mapStateToProps
} from '../Filters/FilterPanelToggle'
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


function setupSnapshot(showFilters) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    view: {
      showFilters
    }
  })

  return renderer.create(
    <Provider store={store}>
      <ReduxFilterPanelToggle />
    </Provider>
  )
}

describe( 'initial state', () => {
  it( 'renders Close filters without crashing', () => {
    const target = setupSnapshot( true )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders Filter Results without crashing', () => {
    const target = setupSnapshot( false )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )

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
