import ReduxDateFilter, { DateFilter, mapDispatchToProps } from '../DateFilter'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme';
import thunk from 'redux-thunk'

const DEFAULT_MAX = new Date( '2015-12-31T12:00:00.000Z' )

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    changeDates: jest.fn(),
    fieldName: 'date_received',
    from: '',
    maximumDate: null,
    minimumDate: null,
    through: '',
    title: 'Date CFPB Received the complaint'
  }, initialProps)

  const target = mount(<DateFilter {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(query={}, maxDate=DEFAULT_MAX) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query
  })

  return renderer.create(
    <Provider store={store}>
      <ReduxDateFilter fieldName="date_received"
                       minimumDate={ new Date( '2015-01-01T12:00:00.000Z' ) }
                       maximumDate={ maxDate }
                       title="Date CFPB Received the complaint"
      />
    </Provider>
  )
}

describe('component::DateFilter', () => {
  describe('snapshot', () => {
    it('supports no dates in the Redux Store', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('shows errors', () => {
      const target = setupSnapshot({
        date_received_min: new Date(2016, 0, 1),
        date_received_max: new Date(2000, 0, 1)
      })
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('shows a warning for April 2017', () => {
      const target = setupSnapshot({
        date_received_min: new Date(2016, 0, 1),
        date_received_max: new Date(2018, 0, 1)
      }, new Date( '2019-12-31T12:00:00.000Z' ))
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('DateInput interface', () => {
    let target, props
    beforeEach(() => {
      ({ target, props } = setupEnzyme())
    })

    describe('_onDateEntered', () => {
      it('converts the date to a string', () => {
        target.instance()._onDateEntered('from', new Date(2012, 11, 31))
        expect(target.state('from')).toEqual('12/31/2012')
      })

      it('resets any messages that may have existed', () => {
        target.setState({
          messages: {
            from: 'foo'
          }
        })
        target.instance()._onDateEntered('from', new Date(2012, 11, 31))
        expect(target.state('messages')).toEqual({})
      })

      it('checks for range errors', () => {
        target.setState({
          through: '1/1/2000'
        })
        target.instance()._onDateEntered('from', new Date(2012, 11, 31))
        expect(target.state('messages').ordered).toEqual(
          '\'From\' must be less than \'Through\''
        )
      })

      it('calls changeDates', () => {
        target.instance()._onDateEntered('through', new Date(2012, 11, 31))
        expect(props.changeDates).toHaveBeenCalledWith(
          null, new Date(2012, 11, 31)
        )
      })
    })

    describe('_onError', () => {
      it('associates the error to the field', () => {
        target.instance()._onError('from', 'foo', '2/31/2012')
        expect(target.state()).toEqual({
          from: '2/31/2012',
          messages: {
            from: 'foo'
          },
          through: ''
        })
      })
    })
  })

  describe('componentWillReceiveProps', () => {
    it('does not trigger a new update', () => {
      const {target, props} = setupEnzyme()
      target.setProps({from: '2016-01-01', through: '2015-12-31'})
      expect(props.changeDates).not.toHaveBeenCalled()
    })    
  })

  describe('mapDispatchToProps', () => {
    it('hooks into changeDates', () => {
      const dispatch = jest.fn()
      const props = {fieldName: 'qaz'}
      mapDispatchToProps(dispatch, props).changeDates('foo', 'bar')
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})
