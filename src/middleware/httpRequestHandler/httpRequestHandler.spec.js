import * as httpActions from '../../actions/httpRequests/httpRequests';
import httpRequestHandler from './httpRequestHandler';
import * as api from '../../api/message/message';
import { act } from '@testing-library/react';
import { initialState, setupStore } from '../../testUtils/setupStore';

/**
 * Provide an empty implementation for window.location.assign.
 */
function mockLocationAssign() {
  delete window.location;
  window.location = {
    assign: jest.fn(),
    href: 'http://ccdb-website.gov',
  };
}

const { location } = window;

describe('redux middleware::httpRequestHandler', () => {
  beforeEach(() => {
    mockLocationAssign();
  });

  afterEach(() => {
    window.location = location;
    jest.resetAllMocks();
  });

  describe('other ACTIONS', () => {
    it('does nothing when not GET OR POST', async () => {
      const action = {
        type: 'FAKE_ACTION',
        payload: 'foo',
      };

      const store = setupStore(initialState(), httpRequestHandler);
      store.dispatch(action);
      const { actions } = store.getState().actions;
      expect(actions).toEqual([
        {
          payload: 'foo',
          type: 'FAKE_ACTION',
        },
      ]);
    });
  });

  describe('HTTP_GET_REQUEST', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.resetAllMocks();
    });

    it('fetches successfully data from an API', async () => {
      const expectedData = {
        data: { foo: 'bar' },
      };

      const fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ foo: 'bar' }),
        }),
      );

      const successAction = jest.fn();
      const failAction = jest.fn();
      const failSpy = jest.fn();
      const action = {
        type: httpActions.HTTP_GET_REQUEST,
        payload: {
          onSuccess: successAction,
          onFailure: failAction,
          url: 'http://localhost/foo',
        },
      };

      const config = {
        url: action.payload.url,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      };

      const onResponseMockGetSuccess = jest
        .spyOn(api, 'onResponse')
        .mockImplementation(() => jest.fn());

      const store = setupStore(initialState(), httpRequestHandler);
      store.dispatch(action);
      expect(fetchMock).toHaveBeenCalledWith(action.payload.url, config);

      // allow any pending promises to be resolved
      await act(() => {
        jest.runOnlyPendingTimers();
      });
      const { actions } = store.getState().actions;
      expect(actions).toEqual([action]);
      expect(failAction).not.toHaveBeenCalled();
      expect(failSpy).not.toHaveBeenCalled();
      await expect(onResponseMockGetSuccess).toHaveBeenCalledTimes(1);
      expect(onResponseMockGetSuccess).toHaveBeenCalledWith(
        config,
        expectedData,
        successAction,
        expect.anything(),
      );
    });

    it('fetches erroneously data from an API', async () => {
      const successSpy = jest.fn();
      const failSpy = jest.fn();

      const subAction = () => {
        return () => {
          failSpy();
        };
      };

      const action = {
        type: httpActions.HTTP_GET_REQUEST,
        payload: {
          onSuccess: successSpy,
          onFailure: subAction,
          url: 'http://localhost/foo',
        },
      };

      const config = {
        url: action.payload.url,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      };

      const fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ foo: 'bar' }),
        }),
      );

      const store = setupStore(initialState(), httpRequestHandler);
      store.dispatch(action);

      expect(fetchMock).toHaveBeenCalledWith(action.payload.url, config);

      // allow any pending promises to be resolved
      await act(() => {
        jest.runOnlyPendingTimers();
      });

      expect(failSpy).toHaveBeenCalledTimes(1);
    });

    it('redirect when access denied from an API', async () => {
      const successSpy = jest.fn();
      const failSpy = jest.fn();

      const action = {
        type: httpActions.HTTP_GET_REQUEST,
        payload: {
          onSuccess: successSpy,
          onFailure: () => {
            return {
              type: httpActions.HTTP_GET_REQUEST,
              payload: {
                onFailure: failSpy,
                url: 'http://localhost.com/bar',
              },
            };
          },
          url: 'http://localhost/foo',
        },
      };
      const config = {
        url: action.payload.url,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      };

      const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ foo: 'denied' }),
        }),
      );

      const onResponseMockGetDenied = jest
        .spyOn(api, 'onResponse')
        .mockImplementation(() => jest.fn());

      const store = setupStore(initialState(), httpRequestHandler);
      store.dispatch(action);
      expect(fetchMock).toHaveBeenCalledWith(action.payload.url, config);
      // allow any pending promises to be resolved
      await act(() => {
        jest.runOnlyPendingTimers();
      });

      expect(onResponseMockGetDenied).toHaveBeenCalledTimes(0);
      expect(window.location.assign).toHaveBeenCalledWith('/');
    });
  });
});
