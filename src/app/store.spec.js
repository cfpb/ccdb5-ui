import { store } from './store';

describe('redux store', () => {
  it('is configured properly', () => {
    const state = store.getState();
    expect(state.routes.queryString).toEqual('');
  });
});
