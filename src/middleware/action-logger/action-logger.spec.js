import { setupStore } from '../../test-utils/setup-store';

describe('redux middleware::actionLogger', () => {
  it('logs actions', () => {
    const store = setupStore();
    const action = {
      type: 'fake action',
    };
    store.dispatch(action);
    const { actions } = store.getState().actions;
    expect(actions).toEqual([{ type: 'fake action' }]);
  });
});
