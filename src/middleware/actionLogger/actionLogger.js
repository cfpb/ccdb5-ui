import { addAction } from '../../reducers/actions/actionsSlice';

//-----------------------------------------------------------------------------

/**
 * Middleware function that watches for bulk triggers
 * When triggered, the function will keep checking if the bulk process is pending
 * and indicate when the process is finished
 *
 * @param {object} store - Redux store
 * @returns {Function} a closure around the Redux middleware function
 */
export const actionLogger = (store) => (next) => async (action) => {
  if (typeof action === 'function') {
    action(store.dispatch, store.getState);
  } else {
    // Pass the action forward in the chain
    if (typeof action === 'object') {
      // pass non-thunk to the next middleware
      if (action.type !== 'actions/addAction') {
        // prevent infinite loop
        store.dispatch(addAction(action));
      }
      return next(action);
    }
  }
};
