import { mapDispatchToProps } from '../Search/Hero';

describe('mapDispatchToProps', () => {
  it('hooks into showMoreAboutDialog', () => {
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).onMoreAbout();
    expect(dispatch.mock.calls.length).toEqual(1);
  });
});
