import target from '../modal'
import * as types from '../../constants'

describe('reducer:modal', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
      modalType: null,
      modalProps: {}
    })
  })

  it('handles MODAL_SHOWN actions', () => {
    const action = {
      type: types.MODAL_SHOWN,
      modalType: 'foo',
      modalProps: {bar: 'baz'}
    }
    expect(target({}, action)).toEqual({
      modalType: 'foo',
      modalProps: {bar: 'baz'}
    })
  })

  it('handles MODAL_HID actions', () => {
    const action = {
      type: types.MODAL_HID
    }
    expect(target({}, action)).toEqual({
      modalType: null,
      modalProps: {}
    })
  })
})