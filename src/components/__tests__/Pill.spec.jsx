import ReduxPill, { Pill, mapDispatchToProps } from '../Search/Pill';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { SLUG_SEPARATOR } from '../../constants'
import { slugify } from '../../utils'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

function setupEnzyme( { fieldName, filters } = {} ) {
  const props = {
    aggs: {},
    filters: filters ? filters : [],
    fieldName: fieldName ? fieldName : 'foo',
    value: [ 'bar', 'baz', 'qaz' ].join( SLUG_SEPARATOR ),
    trimmed: 'bar',
    remove: jest.fn()
  }

  const target = shallow(<Pill {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {} )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <ReduxPill fieldName="somefield"
                   value={ slugify( 'foo', 'bar' ) }
        />
      </IntlProvider>
    </Provider>
  )
}

describe('component:Pill', () => {
  it( 'renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it('allows the user to remove this filter', () => {
    const { target, props } = setupEnzyme()
    const button = target.find('button');

    button.simulate('click');
    expect(props.remove).toHaveBeenCalled();
  });

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into removeFilter', () => {
      const { props } = setupEnzyme()
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch, props ).remove( { value: 'abc' } )
      expect( dispatch.mock.calls ).toEqual( [ [
        {
          filterName: 'foo',
          filterValue: 'abc',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REMOVED'
        }
      ] ] )
    } )

    it( 'hooks into replaceFilters', () => {
      const { props } = setupEnzyme( { fieldName: 'issue', filters: [] } )
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch, props ).remove( {
        aggs: [
          {
            key: 'abc',
            'sub_issue.raw': {
              buckets: [
                { key: 'def' },
                { key: 'def1' },
                { key: 'def2' } ]
            }
          }
        ],
        filters: [ 'abc123', slugify( 'abc', 'def' ), slugify( 'a', 'b' ) ],
        value: slugify( 'abc', 'def' )
      } )
      expect( dispatch.mock.calls ).toEqual( [ [
        {
          filterName: 'issue',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REPLACED',
          values: [
            'abc123',
            slugify( 'a', 'b' )
          ]
        }
      ] ] )
    } )
  } )
} );
