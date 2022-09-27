import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { mapDispatchToProps, SearchBar } from '../Search/SearchBar';

/**
 *
 * @param initialText
 * @param searchField
 */
function setup(initialText, searchField = 'all') {
  const props = {
    debounceWait: 0,
    searchText: initialText,
    searchField,
    onSearchField: jest.fn(),
    onSearchText: jest.fn(),
  };

  const target = mount(<SearchBar {...props} />);

  return {
    props,
    target,
  };
}
describe('component:SearchBar - Company', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      expect(url).toContain('@@API_suggest_company');
      expect(url).toContain('/?text=');

      return new Promise((resolve) => {
        resolve({
          json: function () {
            return ['foo', 'bar', 'baz', 'qaz'];
          },
        });
      });
    });
  });

  it('receives updates when the parent state changes', () => {
    const node = document.createElement('div');
    const { props } = setup('foo', 'company');

    const view = ReactDOM.render(<SearchBar {...props} />, node);

    props.searchText = 'bar';
    ReactDOM.render(<SearchBar {...props} />, node);
    expect(view.state.inputValue).toEqual('bar');
  });
});

describe('component:SearchBar - All data', () => {
  it('receives updates when the parent state changes', () => {
    const node = document.createElement('div');
    const { props } = setup('foo', 'all');
    const view = ReactDOM.render(<SearchBar {...props} />, node);
    props.searchField = 'all';
    props.searchText = 'bar';
    ReactDOM.render(<SearchBar {...props} />, node);
    expect(view.state.inputValue).toEqual('bar');
  });

  it('calls the callback when the form is submitted', () => {
    const { target, props } = setup('bar');
    const theForm = target.find('form');

    theForm.simulate('submit', { preventDefault: () => {} });
    expect(props.onSearchText).toHaveBeenCalledWith('bar');
  });

  describe('Typeahead interface', () => {
    let target, props;
    beforeEach(() => {
      ({ target, props } = setup('BAR'));
    });

    describe('_onInputChange', () => {
      it('provides a promise', () => {
        const { target } = setup();
        const actual = target.instance()._onInputChange('BA');
        expect(actual.then).toBeInstanceOf(Function);
      });

      it('provides empty promise when not Company', () => {
        const { target } = setup('foo', 'all');
        const actual = target.instance()._onInputChange('BA');
        expect(actual.then).toBeInstanceOf(Function);
      });

      it('sets the state', () => {
        const { target } = setup();
        const actual = target.instance()._onInputChange('BA');
        expect(target.state('inputValue')).toEqual('BA');
      });
    });

    describe('_renderOption', () => {
      it('produces a custom component', () => {
        const { target } = setup();
        const option = {
          key: 'Foo',
          label: 'foo',
          position: 0,
          value: 'FOO',
        };
        const { value, component } = target.instance()._renderOption(option);
        expect(value).toEqual('Foo');
        expect(component).toMatchObject({
          props: {
            label: 'foo',
            position: 0,
            value: 'FOO',
          },
        });
      });
    });

    describe('_onTypeaheadSelected', () => {
      it('handles objects', () => {
        const key = 'Bank';
        target.instance()._onTypeaheadSelected({ key });
        expect(props.onSearchText).toHaveBeenCalledWith('Bank');
      });

      it('handles strings', () => {
        const key = 'Bank';
        target.instance()._onTypeaheadSelected(key);
        expect(props.onSearchText).toHaveBeenCalledWith('Bank');
      });
    });

    describe('_onSelectSearchField', () => {
      it('calls action', () => {
        target
          .instance()
          ._onSelectSearchField({ target: { value: 'company' } });
        expect(props.onSearchField).toHaveBeenCalledWith('company');
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into onSearchField', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onSearchField('bar');
      expect(dispatch.mock.calls.length).toEqual(1);
    });

    it('hooks into onSearchText', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onSearchText('foo');
      expect(dispatch.mock.calls.length).toEqual(1);
    });

    it('hooks into onSearchTipToggle', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onSearchTipToggle(true);
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
