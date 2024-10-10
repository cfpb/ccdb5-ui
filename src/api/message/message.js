/**
 * Dispatch and override the action to persist query string
 *
 * @param {object} config - the details of the HTTP Request
 * @param {object} response - the current response from an HTTP request
 * @param {Function} successAction - the action type of a successful message
 * @param {object} store - the current state of all reducers
 */
export function onResponse(config, response, successAction, store) {
  const actionPayload = {
    data: response.data,
    context: config,
  };

  store.dispatch(successAction(actionPayload));
}
