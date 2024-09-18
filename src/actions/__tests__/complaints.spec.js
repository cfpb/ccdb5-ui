import * as sut from '..';
import * as constants from '../../constants';
import { initialState, setupStore } from '../../testUtils/setupStore';

describe('action::complaints', () => {
  let expectedHitsQS, expectedQS, fixtureStore;

  beforeEach(() => {
    expectedHitsQS =
      '@@API?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&frm=0&no_aggs=true&size=25&sort=created_date_desc';
  });
  describe('getAggregations', () => {
    beforeEach(() => {
      fixtureStore = initialState();
      expectedQS =
        '@@API?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=0';
    });

    it('executes a chain of actions', function () {
      fixtureStore.view.tab = constants.MODE_LIST;

      const store = setupStore(fixtureStore);
      const url = expectedQS;

      const expectedActions = [
        sut.aggregationsApiCalled(url),
        sut.httpGet(url, sut.aggregationsReceived, sut.aggregationsApiFailed),
      ];
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
      expectedUrl = expectedHitsQS;
      fixtureStore.view.tab = constants.MODE_LIST;
    });

    it('executes a chain of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [
        sut.complaintsApiCalled(expectedUrl),
        sut.httpGet(
          expectedUrl,
          sut.complaintsReceived,
          sut.complaintsApiFailed,
        ),
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
      fixtureStore.view.tab = constants.MODE_DETAIL;
      expectedUrl = '@@API123';
    });

    it('executes a series of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [
        sut.complaintDetailCalled(expectedUrl),
        sut.httpGet(
          expectedUrl,
          sut.complaintDetailReceived,
          sut.complaintDetailFailed,
        ),
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
      fixtureStore.view.tab = constants.MODE_MAP;
      expectedUrl =
        '@@APIgeo/states/?date_received_max=2020-05-05' +
        '&date_received_min=2017-05-05&field=all&frm=0&no_aggs=true' +
        '&size=25&sort=created_date_desc&no_aggs=true';
    });

    it('executes a series of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [
        sut.statesApiCalled(expectedUrl),
        sut.httpGet(expectedUrl, sut.statesReceived, sut.statesApiFailed),
      ];
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
      fixtureStore.view.tab = constants.MODE_TRENDS;
      expectedUrl =
        '@@APItrends?date_received_max=2020-05-05' +
        '&date_received_min=2017-05-05&field=all&frm=0&lens=product' +
        '&no_aggs=true&searchField=all&size=25&sort=created_date_desc' +
        '&sub_lens=sub_product&trend_depth=5&trend_interval=month&no_aggs=true';
    });

    it('executes a series of actions', function () {
      const store = setupStore(fixtureStore);
      const expectedActions = [
        sut.trendsApiCalled(expectedUrl),
        sut.httpGet(expectedUrl, sut.trendsReceived, sut.trendsApiFailed),
      ];
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
