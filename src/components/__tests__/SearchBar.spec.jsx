import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from 'enzyme'
import { SearchBar, mapDispatchToProps } from '../Search/SearchBar'
import * as types from '../../constants'

function setup(initialText) {
  const props = {
    debounceWait: 0,
    searchText: initialText,
    searchField: 'all',
    onSearchField: jest.fn(),
    onSearchText: jest.fn()
  }

  const target = mount(<SearchBar {...props} />)

  return {
    props,
    target
  }
}
describe('component:SearchBar', () =>{
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      expect(url).toContain('@@API_suggest_company')
      expect(url).toContain('/?text=')

      return new Promise((resolve) => {
        resolve({
          json: function() {
            return ['foo', 'bar', 'baz', 'qaz']
          }
        })
      })
    })
  })

  it('receives updates when the parent state changes', () => {
    const node = document.createElement('div')
    const {props} = setup('foo')
    props.searchField = 'company';

    const target = ReactDOM.render(<SearchBar {...props} />, node)

    props.searchText = 'bar'
    ReactDOM.render(<SearchBar {...props} />, node)
    expect(target.state.inputValue).toEqual('bar')
  })
})

describe('component:SearchBar', () =>{
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      expect(url).toContain('@@API_suggest')
      expect(url).toContain('/?text=')

      return new Promise((resolve) => {
        resolve({
          json: function() {
            return ['foo', 'bar', 'baz', 'qaz']
          }
        })
      })
    })
  })

  it('receives updates when the parent state changes', () => {
    const node = document.createElement('div')
    const {props} = setup('foo')
    const target = ReactDOM.render(<SearchBar {...props} />, node)

    props.searchText = 'bar'
    ReactDOM.render(<SearchBar {...props} />, node)
    expect(target.state.inputValue).toEqual('bar')
  })

  it('calls the callback when the form is submitted', () => {
    const { target, props } = setup('bar')
    const theForm = target.find('form')

    theForm.simulate('submit', { preventDefault: () => {} })
    expect(props.onSearchText).toHaveBeenCalledWith('bar')
  })

  it('changes AdvancedShown state from initial false, to true and back', () => {
    const { target } = setup('foo')
    expect(target.state('advancedShown')).toEqual(false);
    target.instance()._onAdvancedClicked();
    expect(target.state('advancedShown')).toEqual(true);
    target.instance()._onAdvancedClicked();
    expect(target.state('advancedShown')).toEqual(false);
  })

  describe('Typeahead interface', () => {
    let target, props
    beforeEach(() => {
      ({target, props} = setup('BAR'))
    })

    describe('_onInputChange', () => {
      it('provides a promise', () => {
        const {target} = setup()
        const actual = target.instance()._onInputChange('BA')
        expect(actual.then).toBeInstanceOf(Function)
      })

      it('sets the state', () => {
        const {target} = setup()
        const actual = target.instance()._onInputChange('BA')
        expect(target.state('inputValue')).toEqual('BA')
      })
    })

    describe('_renderOption', () => {
      it('produces a custom component', () => {
        const { target } = setup()
        const option = {
          key: 'Foo',
          label: 'foo',
          position: 0,
          value: 'FOO'
        }
        const actual = target.instance()._renderOption(option)
        expect(actual.value).toEqual('Foo')
        expect(actual.component).toMatchObject({
          props: {
            label: 'foo',
            position: 0,
            value: 'FOO'
          }
        })
      })
    })

    describe('_onTypeaheadSelected', () => {
      it('handles objects', () => {
        const key = 'Bank'
        target.instance()._onTypeaheadSelected({key})
        expect(props.onSearchText).toHaveBeenCalledWith('Bank')
      })

      it('handles strings', () => {
        const key = 'Bank'
        target.instance()._onTypeaheadSelected(key)
        expect(props.onSearchText).toHaveBeenCalledWith('Bank')
      })
    })

    describe('_onSelectSearchField', () => {
      it('calls action', () => {
        target.instance()._onSelectSearchField({target: { value: 'company'}})
        expect(props.onSearchField).toHaveBeenCalledWith('company')
      })
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into onSearchField', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onSearchField( 'bar')
      expect(dispatch.mock.calls.length).toEqual(1)
    })

    it('hooks into onSearchText', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onSearchText('foo')
      expect(dispatch.mock.calls.length).toEqual(1)
    })

  })
})
