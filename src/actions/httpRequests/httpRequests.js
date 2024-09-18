import { createAction } from '@reduxjs/toolkit';

export const HTTP_GET_REQUEST = 'HTTP_GET_REQUEST';
export const HTTP_GET_REQUEST_SUCCEEDED = 'HTTP_GET_REQUEST_SUCCEEDED';
export const HTTP_GET_REQUEST_FAILED = 'HTTP_GET_REQUEST_FAILED';

// ----------------------------------------------------------------------------
// Action Creators
/**
 * Builds an action for an HTTP GET
 *
 * @param {string} url - the URL to call
 * @param {string} [onSuccess=HTTP_REQUEST_SUCCEEDED] - the action to dispatch if
 *     successful
 * @param {string} [onFailure=HTTP_REQUEST_FAILED] - the action to dispatch if
 *     unsuccessful
 * @returns {object} a packaged payload to be used by the middleware
 */
export const httpGet = createAction(
  HTTP_GET_REQUEST,
  function prepare(url, onSuccess, onFailure) {
    return {
      payload: {
        url,
        onSuccess: onSuccess || HTTP_GET_REQUEST_SUCCEEDED,
        onFailure: onFailure || HTTP_GET_REQUEST_FAILED,
      },
    };
  },
);
