import getIcon from './iconMap';

describe('getIcon', () => {
  const consoleSpy = jest.spyOn(console, 'error');
  it('gets a known icon', () => {
    const res = getIcon('minus-round');
    expect(JSON.stringify(res)).toBe(
      '{"type":{},"key":null,"props":{"className":"cf-icon-svg "},"_owner":null,"_store":{}}',
    );
  });

  it('handles a unknown icons', () => {
    expect(getIcon('bogus')).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('No icon with the name bogus.');
  });
});
