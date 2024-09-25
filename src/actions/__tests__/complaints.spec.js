import * as sut from '..';
import * as constants from '../../constants';
import { initialState, setupStore } from '../../testUtils/setupStore';
import {
  AGGREGATIONS_API_CALLED,
  COMPLAINT_DETAIL_CALLED,
  COMPLAINTS_API_CALLED,
  STATES_API_CALLED,
  TRENDS_API_CALLED,
} from '..';

describe('action::complaints', () => {
  let expectedHitsQS, expectedQS, fixtureStore;

  beforeEach(() => {
    expectedHitsQS =
      '@@API?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=25&sort=created_date_desc';
  });
  describe('getAggregations', () => {
    beforeEach(() => {
      fixtureStore = initialState();
      fixtureStore.query.tab = constants.MODE_LIST;
      expectedQS =
        '@@API?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&sort=created_date_desc&size=0';
    });

    it('executes a chain of actions', function () {
      const store = setupStore(fixtureStore);
      const url = expectedQS;
      const expectedActions = [sut.callingApi(AGGREGATIONS_API_CALLED, url)];
      store.dispatch(sut.getAggregations());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });

    it('discards duplicate API calls', () => {
      fixtureStore.aggs.activeCall = expectedQS;
      const store = setupStore(fixtureStore);
      const expectedActions = [];

      store.dispatch(sut.getAggregations());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });
  });

  describe('getComplaints', () => {
    let expectedUrl;
    beforeEach(() => {
      fixtureStore = initialState();
      expectedUrl = expectedHitsQS;
      fixtureStore.query.tab = constants.MODE_LIST;
    });

    it('executes a chain of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [
        sut.callingApi(COMPLAINTS_API_CALLED, expectedUrl),
      ];
      store.dispatch(sut.getComplaints());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });

    it('discards duplicate API calls', () => {
      fixtureStore.results.activeCall = expectedUrl;
      const store = setupStore(fixtureStore);
      const expectedActions = [];

      store.dispatch(sut.getComplaints());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });
  });

  describe('getComplaintDetail', () => {
    let expectedUrl;

    beforeEach(() => {
      fixtureStore = initialState();
      fixtureStore.query.tab = constants.MODE_DOCUMENT;
      expectedUrl = '@@API123';
    });

    it('executes a series of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [
        sut.callingApi(COMPLAINT_DETAIL_CALLED, expectedUrl),
      ];
      store.dispatch(sut.getComplaintDetail(123));
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });

    it('discards duplicate API calls', function () {
      fixtureStore.detail.activeCall = expectedUrl;
      const store = setupStore(fixtureStore);
      const expectedActions = [];
      store.dispatch(sut.getComplaintDetail(123));
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });
  });

  describe('getStates', () => {
    let expectedUrl;

    beforeEach(() => {
      fixtureStore = initialState();
      fixtureStore.query.tab = constants.MODE_MAP;
      expectedUrl =
        '@@APIgeo/states/?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&no_aggs=true';
    });

    it('executes a series of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [sut.callingApi(STATES_API_CALLED, expectedUrl)];
      store.dispatch(sut.getStates());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });

    it('discards duplicate API calls', function () {
      fixtureStore.map.activeCall = expectedUrl;
      const store = setupStore(fixtureStore);
      const expectedActions = [];
      store.dispatch(sut.getStates());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });
  });

  describe('getTrends', () => {
    let expectedUrl;

    beforeEach(() => {
      fixtureStore = initialState();
      fixtureStore.query.tab = constants.MODE_TRENDS;
      expectedUrl =
        '@@APItrends/?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month&no_aggs=true';
    });

    it('executes a series of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [sut.callingApi(TRENDS_API_CALLED, expectedUrl)];
      store.dispatch(sut.getTrends());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });

    it('discards duplicate API calls', function () {
      fixtureStore.trends.activeCall = expectedUrl;
      const store = setupStore(fixtureStore);
      const expectedActions = [];
      store.dispatch(sut.getTrends());
      const { actions } = store.getState().actions;
      expect(actions).toEqual(expectedActions);
    });
  });
});
