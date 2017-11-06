import { shallow } from 'enzyme'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxDataExport, { DataExport, mapDispatchToProps } from '../DataExport'

function setupEnzyme() {
  const props = {
    allComplaints: 999,
    exportAll: jest.fn(),
    exportSome: jest.fn(),
    onOtherFormats: jest.fn(),
    someComplaints: 99
  }

  const target = shallow(<DataExport {...props} />)

  return {
    props,
    target
  }
}

function setupSnapshot(total=1001) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    results: {
      doc_count: 9999,
      total
    },
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxDataExport />
      </IntlProvider>
    </Provider>
  )
}

describe('component::DataExport', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('hides the dataset radio buttons when there is no filter', () => {
      const target = setupSnapshot(9999)
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('user interaction', () => {
    let target, props
    beforeEach(() => {
      ({target, props} = setupEnzyme())
    })

    it('supports changing the format', () => {
      const radio = target.find('#format_csv')
      radio.simulate('change', { target: radio.getElements()[0].props })
      expect(target.state('format')).toEqual('csv')
    })

    it('supports changing the which dataset is used', () => {
      const radio = target.find('#dataset_filtered')
      radio.simulate('change', { target: radio.getElements()[0].props })
      expect(target.state('dataset')).toEqual('filtered')
    })

    it('provides link to Socrata', () => {
      const btn = target.find('.other-formats button')
      btn.simulate('click')
      expect(props.onOtherFormats).toHaveBeenCalled()
    })

    describe('clicking Start Export', () => {
      let startExport
      beforeEach(() => {
        startExport = target.find('.footer button').first()
      })

      it('is disabled at the beginning', () => {
        expect(startExport.prop('disabled')).toEqual(true)
      })

      it('calls a specific action when "filtered" is chosen', () => {
        target.setState({dataset: 'filtered'})
        startExport.simulate('click')
        expect(props.exportSome).toHaveBeenCalled()
      })

      it('calls a specific action when "all" is chosen', () => {
        target.setState({dataset: 'full'})
        startExport.simulate('click')
        expect(props.exportAll).toHaveBeenCalled()
      })

      it('displays the long download warning', () => {
        target.setState({dataset: 'full'})
        startExport.simulate('click')
        expect(target.state('mode')).toEqual('NOTIFYING')
      })
    })
  })

  describe('componentWillReceiveProps', () => {
    it('reruns all the validations', () => {
      const {target} = setupEnzyme()
      target.setProps({someComplaints: 999})
      expect(target.state('messages')).toEqual(
        { format: 'You must select a format for the export' }
      )
    })
    
  })

  describe('mapDispatchToProps', () => {
    it('provides a way to call visitSocrata', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onOtherFormats()
      expect(dispatch.mock.calls.length).toEqual(1)
    })

    it('provides a way to call exportAllResults', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).exportAll('json')
      expect(dispatch.mock.calls.length).toEqual(1)
    })

    it('provides a way to call exportSomeResults', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).exportSome('csv', 1300)
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})
