/* eslint-disable max-nested-callbacks, no-empty-function, camelcase */
import * as sutComplaints from '../complaints';
import * as sutSQ from '../sendQuery/sendQuery';
import * as sutHits from '../sendHitsQuery/sendHitsQuery';
import cloneDeep from 'lodash/cloneDeep';
import * as constants from '../../constants';
import emptyStore from '../__fixtures__/emptyStore';

describe('api::sendQuery', () => {
  let fixtureStore;
  beforeEach(function () {
    fixtureStore = cloneDeep(emptyStore);
  });

  describe('sendQuery', () => {
    let dispatch, getState, agSpy, hitSpy;

    beforeEach(function () {
      dispatch = jest.fn();
      getState = () => fixtureStore;
      agSpy = jest.spyOn(sutComplaints, 'getAggregations');
      hitSpy = jest.spyOn(sutHits, 'sendHitsQuery');
    });

    afterEach(function () {
      agSpy.mockRestore();
      hitSpy.mockRestore();
    });

    it('ignores unknown view modes', function () {
      fixtureStore.query.tab = 'NOTHING';
      sutSQ.sendQuery()(dispatch, getState);
      expect(dispatch).not.toHaveBeenCalled();
    });

    const doubleQueries = [
      constants.MODE_LIST,
      constants.MODE_MAP,
      constants.MODE_TRENDS,
    ];

    doubleQueries.forEach((mode) => {
      it(`executes a set of actions in ${mode} mode`, () => {
        fixtureStore.query.tab = mode;

        sutSQ.sendQuery()(dispatch, getState);
        expect(dispatch.mock.calls.length).toEqual(2);
        expect(agSpy).toHaveBeenCalled();
        expect(hitSpy).toHaveBeenCalled();
      });
    });
  });
});
