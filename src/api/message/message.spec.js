/* eslint-disable max-nested-callbacks */
import * as actions from '../../actions/index';
import * as sut from './message';

import { setupStore } from '../../testUtils/setupStore';
import { act } from '@testing-library/react';

describe('message', () => {
  describe('onResponse', () => {
    let store;
    beforeEach(() => {
      store = setupStore();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('passes on actions onResponse', async () => {
      const aggReceived = actions.aggregationsReceived;
      sut.onResponse(
        {},
        {
          data: {
            aggregations: {},
            hits: { total: { value: 99 } },
            _meta: { total_record_count: 0 },
          },
        },
        aggReceived,
        store,
      );
      await act(() => jest.runOnlyPendingTimers());
      const expectedActions = store.getState().actions.actions;
      expect(expectedActions).toEqual([
        {
          meta: { requery: 'REQUERY_NEVER' },
          type: aggReceived().type,
          payload: {
            context: {},
            data: {
              _meta: {
                total_record_count: 0,
              },
              aggregations: {},
              hits: { total: { value: 99 } },
            },
          },
        },
      ]);
    });
  });
});
