import {
  LensTabs,
  mapDispatchToProps,
  mapStateToProps,
} from '../Trends/LensTabs';
import React from 'react';
import { REQUERY_ALWAYS } from '../../constants';
import { shallow } from 'enzyme';
import * as utils from '../../utils';

describe('component:LensTabs', () => {
  describe('buttons', () => {
    let cb = null;
    let target = null;

    beforeEach(() => {
      cb = jest.fn();
      target = shallow(
        <LensTabs
          onTab={cb}
          lens="Product"
          hasProductTab={true}
          subLens="Issue"
          showTitle={true}
        />
      );
    });

    it('tabChanged is called with Product when the button is clicked', () => {
      const prev = target.find('.tabbed-navigation button.sub_product');
      prev.simulate('click');
      expect(cb).toHaveBeenCalledWith('Product', 'sub_product');
    });

    it('tabChanged is called with Issue when the button is clicked', () => {
      const prev = target.find('.tabbed-navigation button.issue');
      prev.simulate('click');
      expect(cb).toHaveBeenCalledWith('Product', 'issue');
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into changeDataSubLens', () => {
      const dispatch = jest.fn();
      const gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
      mapDispatchToProps(dispatch).onTab('Some Lens', 'product');
      expect(dispatch.mock.calls).toEqual([
        [
          {
            requery: REQUERY_ALWAYS,
            subLens: 'product',
            type: 'DATA_SUBLENS_CHANGED',
          },
        ],
      ]);
      expect(gaSpy).toHaveBeenCalledWith('Button', 'Some Lens:Products');
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          focus: '',
          lens: 'foo',
          subLens: 'bar',
        },
        trends: {
          results: {
            foo: [],
          },
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        focus: '',
        lens: 'foo',
        hasProductTab: true,
        subLens: 'bar',
      });
    });
  });
});
