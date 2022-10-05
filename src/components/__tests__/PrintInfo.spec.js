import { getComplaintCountText, mapStateToProps } from '../Print/PrintInfo';
import React from 'react';

describe('component: PrintInfo', () => {
  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        aggs: {
          doc_count: 4000,
          total: 1000,
        },
        query: {
          date_received_max: '2020-03-05T05:00:00.000Z',
          date_received_min: '2017-03-05T05:00:00.000Z',
          searchText: 'foobar',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual.complaintCountText).toBeTruthy();
      expect(actual).toEqual(
        expect.objectContaining({
          dates: '3/5/2017 - 3/5/2020',
          searchText: 'foobar',
        })
      );
    });
  });

  describe('getComplaintCountText', () => {
    it('gets text when counts are filtered', () => {
      const aggs = {
        doc_count: 100,
        total: 100,
      };
      const result = getComplaintCountText(aggs);
      expect(result).toEqual(
        <div>
          Showing <span>100</span> complaints
        </div>
      );
    });
  });
});
