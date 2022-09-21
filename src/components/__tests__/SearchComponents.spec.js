import { mapStateToProps } from '../Search/SearchComponents';
import React from 'react';

describe('component: SearchComponents', () => {
  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        view: {
          isPrintMode: false,
        },
      };
      let actual = mapStateToProps(state);
      expect(actual).toEqual({
        printClass: '',
      });
    });

    it('maps state and props print', () => {
      const state = {
        view: {
          isPrintMode: true,
        },
      };
      let actual = mapStateToProps(state);
      expect(actual).toEqual({
        printClass: 'print',
      });
    });
  });
});
