import { createBrowserHistory } from 'history';

/**
 *
 * @param {object} store - This is the redux store.
 * @returns {Function} a closure around the Redux middleware function
 */
const synchUrl = (store) => (next) => (action) => {
  // Pass the action forward in the chain
  // eslint-disable-next-line callback-return
  const result = next(action);

  // Get the current state
  const state = store.getState();
  // See if processing should continue
  const search = state.query.search;
  // Update the application
  const history = createBrowserHistory();
  const location = history.location;
  if (location.search !== search && !location.pathname.includes('/detail/')) {
    history.push({
      search: search,
    });
  } else {
    return result;
  }
};

export default synchUrl;
