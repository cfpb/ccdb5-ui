/* eslint-disable max-nested-callbacks, no-empty-function, camelcase */
import * as sutComplaints from '../complaints';
import * as sutHits from './sendHitsQuery';
import cloneDeep from 'lodash/cloneDeep';
import * as constants from '../../constants';
import emptyStore from '../__fixtures__/emptyStore';

describe('api::sendHitsQuery', () => {
  let fixtureStore;

  beforeEach(function () {
    fixtureStore = cloneDeep(emptyStore);
  });

  describe('sendHitsQuery', () => {
    let dispatch, getState, spy1, spy2;
    beforeEach(() => {
      dispatch = jest.fn();
      getState = () => fixtureStore;
    });

    afterEach(() => {
      if (spy1 && {}.propertyIsEnumerable.call(spy1, 'mockRestore')) {
        spy1.mockRestore();
      }
      if (spy2 && {}.propertyIsEnumerable.call(spy2, 'mockRestore')) {
        spy2.mockRestore();
      }
    });

    it('executes a specific chain of actions in Map mode', () => {
      fixtureStore.view.tab = constants.MODE_MAP;
      spy1 = jest
        .spyOn(sutComplaints, 'getStates')
        .mockImplementation(() => jest.fn());

      sutHits.sendHitsQuery()(dispatch, getState);
      expect(dispatch.mock.calls.length).toEqual(1);
      expect(spy1).toHaveBeenCalledTimes(1);
    });

    it('executes a specific chain of actions in List Complaints mode', () => {
      fixtureStore.view.tab = constants.MODE_LIST;
      spy1 = jest
        .spyOn(sutComplaints, 'getComplaints')
        .mockImplementation(() => jest.fn());

      sutHits.sendHitsQuery()(dispatch, getState);
      expect(dispatch.mock.calls.length).toEqual(1);
      expect(spy1).toHaveBeenCalledTimes(1);
    });

    it('executes a specific set of actions in Trends mode', () => {
      fixtureStore.view.tab = constants.MODE_TRENDS;
      spy1 = jest
        .spyOn(sutComplaints, 'getTrends')
        .mockImplementation(() => jest.fn());

      sutHits.sendHitsQuery()(dispatch, getState);
      expect(dispatch.mock.calls.length).toEqual(1);
      expect(spy1).toHaveBeenCalledTimes(1);
    });
  });
});
