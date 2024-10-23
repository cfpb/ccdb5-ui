import { HTTP_GET_REQUEST } from '../../actions/httpRequests/httpRequests';
import { onResponse } from '../../api/message/message';

/**
 * Borrowed from https://stackoverflow.com/a/70117817/659014
 *
 * @param {Response} res - Response coming from url call.
 * @returns {Promise<never>} promise from Fetch API
 */
export const handleResponse = (res) => {
  if (res.ok || (res.status >= 400 && res.status < 500)) {
    return res
      .json()
      .then((result) => Promise.resolve(result))
      .catch(() =>
        Promise.resolve({
          status: res.status,
          message: res.statusText,
        }),
      );
  }

  return Promise.reject(res);
};

/**
 * This is a compacted version of
 *
 * function exampleMiddleware(storeAPI) {
 *   return function wrapDispatch(next) {
 *     return function handleAction(action) {
 *       // Do anything here: pass the action onwards with next(action),
 *       // or restart the pipeline with storeAPI.dispatch(action)
 *       // Can also use storeAPI.getState() here
 *
 *       return next(action)
 *     }
 *   }
 * }
 *
 * Further reading https://redux.js.org/advanced/middleware
 *
 * @param {object} store - The Redux store.
 * @returns {Function} a closure around the Redux middleware function
 */
export const httpRequestHandler = (store) => (next) => async (action) => {
  if (![HTTP_GET_REQUEST].includes(action.type)) {
    return next(action);
  }

  // default config
  const config = {
    url: action.payload.url,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  };

  const responseData = {};

  return fetch(config.url, config)
    .then((response) => {
      responseData.status = response.status;
      responseData.statusText = response.statusText;
      return Promise.resolve(handleResponse(response));
    })
    .then((data) => {
      if (data.error || responseData.status >= 400) {
        responseData.data = data;
        throw Error(responseData.statusText);
      } else {
        onResponse(config, { data }, action.payload.onSuccess, store);
      }
    })
    .catch((error) => {
      const actionError = {};
      if (responseData.data) {
        actionError.status = responseData.status;
        actionError.statusText =
          responseData.data.error || 'Something went wrong';
      } else {
        actionError.status = error.status;
        actionError.statusText = error.statusText || 'Something went wrong';
      }

      store.dispatch(
        action.payload.onFailure({
          error: {
            status: actionError.status,
            statusText: actionError.statusText,
          },
          context: config,
        }),
      );

      if (responseData.status === 403)
        // redirect to root / login when unauthorized response
        window.location.assign('/');
    });
};

export default httpRequestHandler;
