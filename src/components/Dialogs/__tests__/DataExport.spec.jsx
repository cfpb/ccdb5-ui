jest.mock('../../../actions/dataExport')

import { shallow } from 'enzyme'
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxDataExport, { DataExport, mapDispatchToProps } from '../DataExport'

const mockDataExportActions = require('../../../actions/dataExport')

function setupEnzyme() {
  const props = {
    allComplaints: 999,
    exportAll: jest.fn(),
    exportSome: jest.fn(),
    someComplaints: 99,
    queryState: 'foo'
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
    aggs: {
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
  beforeAll( () => {
    document.queryCommandSupported = jest.fn(_ => true)
  } );

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

  describe('visual changes', () => {
    it('switches the button after a copy' , () => {
      const target = setupSnapshot()
      const ctlDataExport = target.root.findByType(DataExport)
      ctlDataExport.instance.setState({
        copied: true,
        dataset: 'full',
        exportUri: 'http://www.example.org',
        format: 'csv'
      })

      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    } );    
  } );

  describe('user interaction', () => {
    let target, props
    beforeEach(() => {
      ({target, props} = setupEnzyme())
    })

    it('supports changing the format', () => {
      const radio = target.find('#format_csv')
      radio.simulate('change', { target: radio.getElements()[0].props })
      expect(target.state('format')).toEqual('csv')
      expect(target.state('copied')).toEqual(false)
    })

    it('supports changing the which dataset is used', () => {
      const radio = target.find('#dataset_filtered')
      radio.simulate('change', { target: radio.getElements()[0].props })
      expect(target.state('dataset')).toEqual('filtered')
      expect(target.state('copied')).toEqual(false)
    })

    describe('clicking Copy to Clipboard', () => {
      let copyToClipboardBtn
      beforeEach(() => {
        copyToClipboardBtn = target.find('.heres-the-url button').first()
      })

      it('is disabled at the beginning', () => {
        expect(copyToClipboardBtn.prop('disabled')).toEqual(true)
      })

      it('calls a specific action when "filtered" is chosen', () => {
        const el = { select: jest.fn() }
        const ev = { target: { focus: jest.fn() } }
        document.execCommand = jest.fn();
        document.getElementById = jest.fn(_ => el)

        target.setState({dataset: 'filtered', format: 'csv'})
        copyToClipboardBtn.simulate('click', ev)

        expect(document.getElementById).toHaveBeenCalledWith('exportUri')
        expect(document.execCommand).toHaveBeenCalledWith('copy')
        expect(el.select).toHaveBeenCalledWith()
        expect(ev.target.focus).toHaveBeenCalledWith()
        expect(target.state('copied')).toEqual(true)
      })

    } );

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

  describe('getDerivedStateFromProps', () => {
    let target, state, props
    beforeEach(() => {
      ({target, props} = setupEnzyme())

      state = {
        format: 'csv'
      }
    })

    describe('when dataset == full', () => {
      beforeEach(() => {
        state.dataset = 'full'
      })

      it( 'builds a specific URL' , () => {
        DataExport.getDerivedStateFromProps( props, state )
        expect(mockDataExportActions.buildAllResultsUri).toHaveBeenCalledWith(
          'csv'
        )
      } );
    } );
    describe('when dataset == filtered', () => {
      beforeEach(() => {
        state.dataset = 'filtered'
      })

      it( 'builds a different URL' , () => {
        DataExport.getDerivedStateFromProps( props, state )
        expect(mockDataExportActions.buildSomeResultsUri).toHaveBeenCalledWith(
          'csv', 99, 'foo'
        )
      } );
    } );
  } );

  describe('mapDispatchToProps', () => {

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
