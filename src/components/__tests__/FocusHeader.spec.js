import {
  FocusHeader,
  mapDispatchToProps,
  mapStateToProps,
} from '../Trends/FocusHeader';
import React from 'react';
import { REQUERY_ALWAYS } from '../../constants';
import { shallow } from 'enzyme';

describe('component:FocusHeader', () => {
  describe('buttons', () => {
    let cb = null;
    let target = null;

    beforeEach(() => {
      cb = jest.fn();
      target = shallow(
        <FocusHeader
          clearFocus={cb}
          focus="Focus item"
          lens="Foo"
          total="9,123"
        />
      );
    });

    it('changeFocus is called when the button is clicked', () => {
      const prev = target.find('#clear-focus');
      prev.simulate('click');
      expect(cb).toHaveBeenCalled();
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into removeFocus', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).clearFocus();
      expect(dispatch.mock.calls).toEqual([
        [
          {
            requery: REQUERY_ALWAYS,
            type: 'FOCUS_REMOVED',
          },
        ],
      ]);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          focus: 'Foo',
          lens: 'Bar',
        },
        trends: {
          total: 1000,
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        focus: 'Foo',
        lens: 'Bar',
        total: '1,000',
      });
    });
  });
});
