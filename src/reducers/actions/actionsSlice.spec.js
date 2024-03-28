import actions, { addAction, clearActions } from './actionsSlice';

describe('reducer::actionsSlice', () => {
  it('should handle initial state', () => {
    expect(actions(undefined, {})).toEqual({ actions: [] });
  });

  it('should handle addAction', () => {
    expect(actions(undefined, addAction({ type: 'FOOBAR' }))).toEqual({
      actions: [{ type: 'FOOBAR' }],
    });
  });

  it('should handle clearActions', () => {
    expect(actions({ actions: [{ type: 'FOOBAR' }] }, clearActions())).toEqual({
      actions: [],
    });
  });
});
