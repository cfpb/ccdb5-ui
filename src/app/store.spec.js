import { store } from './store';

describe('redux store', () => {
  it('is configured properly', () => {
    const state = store.getState();
    expect(state.api).toBeDefined();
    expect(state.filters).toBeDefined();
    expect(state.query.searchField).toBe('all');
    expect(state.routes.queryString).toBe('');
    expect(state.view.tab).toBe('Trends');
  });
});
