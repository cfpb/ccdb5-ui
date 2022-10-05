import { mapDispatchToProps } from '../Map/MapPanel';

describe('component:MapPanel', () => {
  describe('mapDispatchToProps', () => {
    it('hooks into dismissWarning', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onDismissWarning();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
