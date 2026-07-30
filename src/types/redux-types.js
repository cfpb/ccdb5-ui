/**
 * @file Redux-related shared JSDoc typedefs (namespaced)
 */

/**
 * @namespace ReduxTypes
 */

/**
 * A plain Redux action.
 *
 * @typedef {object} PlainAction
 * @memberof ReduxTypes
 * @property {string} type - the type of the action
 * @property {unknown} [payload] - the payload of the action
 * @property {unknown} [error] - any error
 * @property {unknown} [meta] - any meta data
 * @property {Record<string, unknown>} [extra] - Any additional fields
 */

/**
 * A Redux thunk function.
 *
 * @typedef {(dispatch: ReduxTypes.Dispatch, getState: ReduxTypes.GetState) => unknown} Thunk
 * @memberof ReduxTypes
 */

/**
 * Redux dispatch that can handle plain actions or thunks.
 *
 * @typedef {(action: ReduxTypes.PlainAction | ReduxTypes.Thunk) => unknown} Dispatch
 * @memberof ReduxTypes
 */

/**
 * Redux getState function.
 *
 * @typedef {() => unknown} GetState
 * @memberof ReduxTypes
 */

/**
 * The `next` function in the middleware chain (accepts only plain actions).
 *
 * @typedef {(action: ReduxTypes.PlainAction) => unknown} Next
 * @memberof ReduxTypes
 */

/**
 * Minimal Redux store shape used by middleware.
 *
 * @typedef {object} Store
 * @memberof ReduxTypes
 * @property {ReduxTypes.Dispatch} dispatch - the dispatch function from redux
 * @property {ReduxTypes.GetState} getState - the getState function from redux
 */

// Make this a module so `import()` type references work.
export {};
