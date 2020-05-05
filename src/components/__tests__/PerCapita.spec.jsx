import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, PerCapita
} from '../RefineBar/PerCapita'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import { GEO_NORM_NONE, GEO_NORM_PER1000 } from '../../constants'

function setupEnzyme( normalization = GEO_NORM_NONE ) {
  const props = {
    dataNormalization: normalization,
    enablePer1000: true,
    onDataNormalization: jest.fn()
  }

  const target = shallow(<PerCapita {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {},
    query: {
      company: [ { name: 'foo', value: 123 } ]
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <PerCapita />
    </Provider>
  )
}

describe( 'component: PerCapita', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it('allows the user to trigger Complaints', () => {
      const { target, props } = setupEnzyme()
      const button = target.find('.raw');

      button.simulate('click');
      expect(props.onDataNormalization).toHaveBeenCalled();
    });

    it('allows the user to trigger Per 1000 Complaints', () => {
      const { target, props } = setupEnzyme()
      const button = target.find('.capita');

      expect( button.hasClass( 'capita' ) ).toBeTruthy()
      expect( button.hasClass( 'selected' ) ).toBeFalsy()
      button.simulate('click');
      expect(props.onDataNormalization).toHaveBeenCalled()
    });

    it('changes Per 1000 button class', () => {
      const { target, props } = setupEnzyme( GEO_NORM_PER1000 )
      const button = target.find('.capita')

      expect( button.hasClass( 'capita' ) ).toBeTruthy()
      expect( button.hasClass( 'selected' ) ).toBeTruthy()

      button.simulate('click')
      expect(props.onDataNormalization).toHaveBeenCalled()
    });
  } )

  describe('mapDispatchToProps', () => {
    it('hooks into onDataNormalization', () => {
      const dispatch = jest.fn();
      const ev = {
        target: {
          value: 123
        }
      }
      mapDispatchToProps(dispatch).onDataNormalization( ev );
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          dataNormalization: 'foo'
        },
        query: {
          enablePer1000: true
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        dataNormalization: 'foo',
        enablePer1000: true
      } )
    } )
  } )
} )
