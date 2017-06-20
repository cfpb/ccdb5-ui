import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { SearchBar, mapDispatchToProps } from '../SearchBar';
import * as types from '../constants'

function setup(initialText) {
  const props = {
    searchText: initialText,
    onSearch: jest.fn()
  }

  const target = shallow(<SearchBar {...props} />);

  return {
    props,
    target
  }
}

describe('component:SearchBar', () =>{
  it('receives updates when the parent state changes', () => {
    const node = document.createElement('div');
    const target = ReactDOM.render(<SearchBar searchText="foo" />, node);

    ReactDOM.render(<SearchBar searchText="bar" />, node);
    expect(target.state.inputValue).toEqual('bar');
  });

  it('calls the callback when the form is submitted', () => {
    const { target, props } = setup('bar')
    const theForm = target.find('form');

    theForm.simulate('submit', { preventDefault: () => {} });
    expect(props.onSearch).toHaveBeenCalledWith('bar')  
  })

  it('records text input from the user', () => {
    const { target } = setup('foo')
    const textInput = target.find('[type="text"]');

    expect(target.state('inputValue')).toEqual('foo');
    textInput.simulate('change', {target: { value: 'bar'}});
    expect(target.state('inputValue')).toEqual('bar');
  });

  describe('mapDispatchToProps', () => {
    it('hooks into onSearch', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onSearch('foo', 'bar');
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })
})
