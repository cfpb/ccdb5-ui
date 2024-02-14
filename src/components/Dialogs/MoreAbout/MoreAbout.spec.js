import { MoreAbout } from './MoreAbout';
import React from 'react';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../../testUtils/test-utils';

describe('MoreAbout', () => {
  it('renders without crashing', () => {
    const closeSpy = jest.fn();
    render(<MoreAbout onClose={closeSpy} />);
    expect(
      screen.getByText('Things you should know before you use this database'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(closeSpy).toHaveBeenCalled();
  });
});
