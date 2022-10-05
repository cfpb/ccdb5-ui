import { shallow } from 'enzyme';
import React from 'react';
import { mapDispatchToProps, mapStateToProps, ZipCode } from '../ZipCode';

/**
 * Sets up enzyme.
 */
function setupEnzyme() {
  const props = {
    forTypeahead: [],
    options: [],
    queryString: '?foo=bar&baz=qaz',
    typeaheadSelect: jest.fn(),
  };

  const target = shallow(<ZipCode {...props} />);

  return {
    props,
    target,
  };
}

describe('component::ZipCode', () => {
  describe('Typeahead interface', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@API_suggest_zip/?foo=bar&baz=qaz&text=');

        return new Promise((resolve) => {
          resolve({
            json: function () {
              return ['foo', 'bar', 'baz', 'qaz'];
            },
          });
        });
      });
    });

    describe('_onInputChange', () => {
      it('provides a promise', () => {
        const { target } = setupEnzyme();
        const actual = target.instance()._onInputChange('20');
        expect(actual.then).toBeInstanceOf(Function);
      });
    });

    describe('_renderOption', () => {
      it('produces a custom component', () => {
        const { target } = setupEnzyme();
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

    describe('_onOptionSelected', () => {
      it('checks the filter associated with the option', () => {
        const { target, props } = setupEnzyme();
        target.instance()._onOptionSelected({ key: 'foo' });
        expect(props.typeaheadSelect).toHaveBeenCalledWith('foo');
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into addMultipleFilters', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).typeaheadSelect('foo');
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        aggs: {
          zip_code: [123, 456, 789],
        },
        query: {
          queryString: '?dsfds=2232',
          searchAfter: '12344_1233',
          state: ['TX', 'FL'],
          zip_code: '',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        options: [123, 456, 789],
        queryString: '?state=TX&state=FL',
        selections: [],
      });
    });
  });
});
