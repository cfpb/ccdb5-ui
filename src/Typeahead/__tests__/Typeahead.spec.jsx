import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import Typeahead, { MODE_OPEN } from '..'
import * as keys from '../../constants'

function setupEnzyme(initalProps={}, removeDebounce=true) {
  const props = Object.assign({
    onInputChange: jest.fn((x) => ['alpha', 'beta', 'gamma']),
    onOptionSelected: jest.fn(),
    renderOption: jest.fn()
  }, initalProps)

  const target = mount(<Typeahead {...props} />);

  // Remove debounce
  if (removeDebounce) {
    const instance = target.instance()
    instance.search = instance._callForOptions
  }

  return {
    props,
    target
  }
}

function setupSnapshot(initialValue='') {
  const target = renderer.create(<Typeahead value={initialValue}
                                    onInputChange={jest.fn()}
                                    onOptionSelected={jest.fn()}
                                 />)
  target.getInstance().setState({focused: true})
  return target
}

describe('component::Typeahead', () => {
  describe('render phases', () => {
    it('renders the EMPTY phase', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders the ERROR phase', () => {
      const target = setupSnapshot()
      target.getInstance().setState({phase: 'ERROR'})
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders the ACCUM phase', () => {
      const target = setupSnapshot('i')
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders the NO_RESULTS phase', () => {
      const target = setupSnapshot()
      target.getInstance()._setOptions([])
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders the RESULTS phase', () => {
      const target = setupSnapshot()
      target.getInstance()._setOptions(['foo'])
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders the TOO_MANY phase', () => {
      const target = setupSnapshot()
      target.getInstance()._setOptions(['foo', 'bar', 'baz', 'qaz', 'quux', 'nuux'])
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('focus/blur', () => {
    const renderOption = x => ( {
      value: x,
      component: x
    } )

    it('sets the current state on blur', () => {
      const {target} = setupEnzyme({ renderOption, value: 'foo' })
      target.setState({focused: true})
      target.simulate('blur')
      expect(target.state('focused')).toEqual(false)
    })

    it('sets the state on focus', () => {
      const {target} = setupEnzyme({ renderOption, value: 'foo' })
      expect(target.state('phase')).toEqual('WAITING')
      expect(target.state('focused')).toEqual(false)
      target.simulate('focus')
      expect(target.state('focused')).toEqual(true)
    })
  })

  describe('text control', () => {
    let target, props, input
    beforeEach(() => {
      ({target, props} = setupEnzyme())
      input = target.find('input')
    })

    it('requires a minimum number of characters before calling for options', () => {
      input.simulate('change', {target: { value: 'b'}})
      expect(target.state('inputValue')).toEqual('b')
      expect(props.onInputChange).not.toHaveBeenCalled()
    })

    it('calls for options when the threshhold has been reached', () => {
      input.simulate('change', {target: { value: 'bar'}})
      expect(target.state('inputValue')).toEqual('bar')
      expect(props.onInputChange).toHaveBeenCalledWith('bar')
    })
  })

  describe('asynchronous options', () => {
    let target, props, input
    let fakePromise, onSuccess, onFail
    beforeEach(() => {
      ({target, props} = setupEnzyme())
      input = target.find('input')

      fakePromise = {
        then: (x, y) => {onSuccess = x, onFail = y}
      }
      props.onInputChange.mockImplementation(() => fakePromise)
    })

    it('detects a promise', () => {
      input.simulate('change', {target: { value: 'bar'}})
      expect(props.onInputChange).toHaveBeenCalledWith('bar')
      expect(target.state('inputValue')).toEqual('bar')
      expect(target.state('phase')).toEqual('WAITING')
    })

    it('sets the options when the promise is resolved', () => {
      input.simulate('change', {target: { value: 'bar'}})
      expect(props.onInputChange).toHaveBeenCalledWith('bar')
      expect(target.state('phase')).toEqual('WAITING')
      onSuccess(['a', 'b'])
      expect(target.state('phase')).toEqual('RESULTS')
    })

    it('enters the error state when the promise is rejected', () => {
      input.simulate('change', {target: { value: 'bar'}})
      expect(props.onInputChange).toHaveBeenCalledWith('bar')
      expect(target.state('phase')).toEqual('WAITING')
      onFail('oops')
      expect(target.state('phase')).toEqual('ERROR')
    })
  })

  describe('keyboard events in CLOSED mode', () => {
    let fixture, target, props, input
    beforeEach(() => {
      ({target, props} = setupEnzyme())
      input = target.find('input')
      fixture = {
        preventDefault: jest.fn()
      }
    })

    it('ignores unknown keys', () => {
      fixture.which = 999
      input.simulate('keydown', fixture)
      expect(fixture.preventDefault).not.toHaveBeenCalled()
    })

    it('resets the control when "ESC" is pressed', () => {
      input.simulate('change', {target: { value: 'bar'}})
      expect(target.state('phase')).toEqual('RESULTS')
      
      fixture.which = keys.VK_ESCAPE
      input.simulate('keydown', fixture)

      expect(target.state('inputValue')).toEqual('')
      expect(target.state('phase')).toEqual('EMPTY')
      expect(fixture.preventDefault).toHaveBeenCalled()
    })

    describe('"DOWN" key', () => {
      it('has no effect when there are no options', () => {
        fixture.which = keys.VK_DOWN
        input.simulate('keydown', fixture)

        expect(target.state('selectedIndex')).toEqual(-1)
        expect(fixture.preventDefault).toHaveBeenCalled()
      })

      it('selects the first option when there is no selection', () => {
        input.simulate('change', {target: { value: 'bar'}})
        fixture.which = keys.VK_DOWN
        input.simulate('keydown', fixture)

        expect(target.state('selectedIndex')).toEqual(0)
      })

      it('has no effect when the last item is selected', () => {
        target.instance().setState({
          selectedIndex: 2,
          searchResults: ['foo', 'bar', 'baz']
        })

        fixture.which = keys.VK_DOWN
        input.simulate('keydown', fixture)

        expect(target.state('selectedIndex')).toEqual(2)
      })
    })

    describe('"UP" key', () => {
      it('has no effect when the first item is selected', () => {
        target.instance().setState({
          selectedIndex: 0,
          searchResults: ['foo', 'bar', 'baz']
        })

        fixture.which = keys.VK_UP
        input.simulate('keydown', fixture)

        expect(target.state('selectedIndex')).toEqual(0)
      })
    })

    describe('ENTER/TAB', () => {
      it('has no effect when there are no options', () => {
        fixture.which = keys.VK_ENTER
        input.simulate('keydown', fixture)
        expect(props.onOptionSelected).not.toHaveBeenCalled()
      })

      it('chooses the first option when there is no selection', () => {
        input.simulate('change', {target: { value: 'bar'}})
        fixture.which = keys.VK_TAB
        input.simulate('keydown', fixture)

        expect(props.onOptionSelected).toHaveBeenCalledWith('alpha')
      })

      it('selects the highlighted option when "TAB" is pressed', () => {
        input.simulate('change', {target: { value: 'bar'}})
        target.instance().setState({
          selectedIndex: 1
        })
        fixture.which = keys.VK_TAB
        input.simulate('keydown', fixture)

        expect(props.onOptionSelected).toHaveBeenCalledWith('beta')
      })
    })
  })

  describe('keyboard events in OPEN mode', () => {
    let fixture, target, props, input
    beforeEach(() => {
      ({target, props} = setupEnzyme({
        mode: MODE_OPEN,
        onInputChange: jest.fn(() => ([
          {key: 'alpha'},
          {key: 'beta'}
        ]))
      }))

      input = target.find('input')
      fixture = {
        preventDefault: jest.fn()
      }

      input.simulate('change', {target: { value: 'bar'}})
      expect(target.state('phase')).toEqual('RESULTS')
    })

    afterEach(() => {
      expect(fixture.preventDefault).toHaveBeenCalled()
    })

    it('hides the drop down when "ESC" is pressed', () => {
      fixture.which = keys.VK_ESCAPE
      input.simulate('keydown', fixture)

      expect(target.state('inputValue')).toEqual('bar')
      expect(target.state('phase')).toEqual('CHOSEN')
    })

    describe('arrow keys', () => {
      it('sets the text box value to the selected value', () => {
        fixture.which = keys.VK_DOWN
        input.simulate('keydown', fixture)

        expect(target.state('selectedIndex')).toEqual(0)
        expect(target.state('inputValue')).toEqual('alpha')
      })

      it('has no effect when there are no results', () => {
        target.instance()._calculateNewIndex = jest.fn(() => -1)

        fixture.which = keys.VK_DOWN
        input.simulate('keydown', fixture)

        expect(target.state('selectedIndex')).toEqual(-1)
        expect(target.state('inputValue')).toEqual('bar')
      })
    })

    describe('ENTER/TAB', () => {
      it('selects the highlighted option', () => {
        target.instance().setState({
          selectedIndex: 1
        })
        fixture.which = keys.VK_TAB
        input.simulate('keydown', fixture)

        expect(props.onOptionSelected).toHaveBeenCalledWith({ key: 'beta'})
        expect(target.state('inputValue')).toEqual('bar')
        expect(target.state('phase')).toEqual('CHOSEN')
        expect(target.state('searchResults')).toEqual([])
        expect(target.state('selectedIndex')).toEqual(-1)
      })

      it('uses the text box value when there are no options', () => {
        target.instance().setState({
          selectedIndex: -1,
          searchResults: []
        })
        fixture.which = keys.VK_TAB
        input.simulate('keydown', fixture)

        expect(props.onOptionSelected).toHaveBeenCalledWith('bar')
        expect(target.state('phase')).toEqual('CHOSEN')
      })

      it('uses the text and not the highlighted option', () => {
        target.instance().setState({
          selectedIndex: 1,
          inputValue: 'be'
        })
        fixture.which = keys.VK_ENTER
        input.simulate('keydown', fixture)

        expect(props.onOptionSelected).toHaveBeenCalledWith('be')
        expect(target.state('inputValue')).toEqual('be')
        expect(target.state('phase')).toEqual('CHOSEN')
      })
    })
  })

  describe('clear button in OPEN mode', () => {
    let target, props, button
    beforeEach(() => {
      ({target, props} = setupEnzyme({
        mode: MODE_OPEN,
        value: 'bar'
      }))

      button = target.find('button')
    })

    it('clears the value and triggers a search', () => {
      button.simulate('click')
      expect(props.onOptionSelected).toHaveBeenCalledWith('')
    })
  })
})
