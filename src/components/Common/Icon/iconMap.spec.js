import getIcon from './iconMap';

describe('getIcon', () => {
  const consoleSpy = jest.spyOn(console, 'error');
  it('gets a known custom icon', () => {
    const res = getIcon('line-chart');
    expect(res).toBeTruthy();
    expect(res.props.className).toContain('cf-icon-svg');
  });

  it('handles unknown icons', () => {
    expect(getIcon('bogus')).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('No icon with the name bogus.');
  });
});
