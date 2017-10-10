import { shallow } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from '../../constants'
import ReduxRootModal, {RootModal, mapDispatchToProps} from '../RootModal'

// import { shallow } from 'enzyme';

function setupEnzyme() {
  const props = {
    modalType: types.MODAL_TYPE_DATA_EXPORT,
    modalProps: {},
    onClose: jest.fn()
  }

  const target = shallow(<RootModal {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    modal: {}
  })

  return renderer.create(
    <Provider store={store}>
      <ReduxRootModal />
    </Provider>
  )
}

describe('component::RootModal', () => {
  describe('initial state', () => {
    it('does not render modals initially', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('only renders registered dialogs', () => {
    const {target, props} = setupEnzyme()
    expect(target.getElements()[0].type).not.toEqual('span')
    expect(target.getElements()[0].type).toBeInstanceOf(Function)
  })

  describe('mapDispatchToProps', () => {
    it('hooks into onClose', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onClose()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})

