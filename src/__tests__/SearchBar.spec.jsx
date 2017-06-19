import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { SearchBar, mapDispatchToProps } from '../SearchBar';
import * as types from '../constants'

describe('component:SearchBar', () =>{
  it('receives updates when the parent state changes', () => {
     const node = document.createElement('div');
     const target = ReactDOM.render(<SearchBar searchText="foo" />, node);

     ReactDOM.render(<SearchBar searchText="bar" />, node);
     expect(target.state.inputValue).toEqual('bar');
  });

  it('calls the callback when the form is submitted', () => {
    const cb = jest.fn();
    const target = shallow(<SearchBar searchText="qaz" onSearch={cb} />);
    const theForm = target.find('form');

    theForm.simulate('submit', { preventDefault: () => {} });
    expect(cb).toHaveBeenCalledWith('qaz');
  })

  it('records text input from the user', () => {
    const target = shallow(<SearchBar searchText="foo" />);
    const textInput = target.find('[type="text"]');

    expect(target.state('inputValue')).toEqual('foo');
    textInput.simulate('change', {target: { value: 'bar'}});
    expect(target.state('inputValue')).toEqual('bar');
  });

  describe('mapDispatchToProps', () => {
    let dispatchSpy = null;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    })

    describe('onSearch', () => {
      it('calls the SEARCH_TEXT action', () => {
        const {onSearch} = mapDispatchToProps(dispatchSpy);
        onSearch('foo', 'bar');
        const searchCall = dispatchSpy.mock.calls[0][0];

        expect(dispatchSpy.mock.calls.length).toEqual(2);
        expect(searchCall.type).toEqual(types.SEARCH_TEXT);
        expect(searchCall.searchText).toEqual('foo');
        expect(searchCall.searchType).toEqual('qaz');
      })
    })
  })
})
