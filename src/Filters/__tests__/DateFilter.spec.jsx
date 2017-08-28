import ReduxDateFilter, { DateFilter, mapDispatchToProps } from '../DateFilter'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme';
import thunk from 'redux-thunk'

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    changeDateRange: jest.fn(),
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

function setupSnapshot(query={}) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query
  })

  return renderer.create(
    <Provider store={store}>
      <ReduxDateFilter fieldName="date_received"
                       minimumDate={ new Date( '2015-01-01' ) }
                       maximumDate={ new Date( '2015-12-31' ) }
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

    xit('shows errors', () => {
      const target = setupSnapshot({
        date_received_min: new Date(2016, 0, 1),
        date_received_max: new Date(2000, 0, 1)
      })
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  xdescribe('date entry', () => {
    it('triggers an update when a valid from date is entered', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input[aria-describedby="input-error_message-from"]')
      input.simulate('change', { target: { value: '2015-06-07' }})
      const actual = props.changeDateRange.mock.calls[0]
      expect(actual[0]).toEqual(expect.any(Date))
      expect(actual[0].getFullYear()).toEqual(2015)
      expect(actual[0].getMonth()).toEqual(6-1)
      expect(actual[1]).toEqual(null)
    })

    it('triggers an update when a valid through date is entered', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input[aria-describedby="input-error_message-through"]')
      input.simulate('change', { target: { value: '2015-06-07' }})
      const actual = props.changeDateRange.mock.calls[0]
      expect(actual[1]).toEqual(expect.any(Date))
      expect(actual[1].getFullYear()).toEqual(2015)
      expect(actual[1].getMonth()).toEqual(6-1)
      expect(actual[0]).toEqual(null)
    })

    it('does not trigger an update when an invalid date is entered', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input[aria-describedby="input-error_message-from"]')
      input.simulate('change', { target: { value: '9999-99-9' }})
      expect(props.changeDateRange).not.toHaveBeenCalled()
      expect(target.state('messages').from).toEqual("'9999-99-9' is not a valid date.")
    })
  })

  xdescribe('componentWillReceiveProps', () => {
    it('does not trigger a new update', () => {
      const {target, props} = setupEnzyme()
      target.setProps({from: '2016-01-01', through: '2015-12-31'})
      expect(props.changeDateRange).not.toHaveBeenCalled()
    })    
  })

  describe('mapDispatchToProps', () => {
    it('hooks into changeDateRange', () => {
      const dispatch = jest.fn()
      const props = {fieldName: 'qaz'}
      mapDispatchToProps(dispatch, props).changeDateRange('foo', 'bar')
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})
