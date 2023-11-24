import React from 'react';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import * as viewActions from '../../../reducers/view/view';
import { ExportConfirmation } from './ExportConfirmation';

describe('ExportConfirmation', () => {
  const renderComponent = () => {
    render(<ExportConfirmation />);
  };

  it('renders default state without crashing', async () => {
    const hideModalSpy = jest
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => jest.fn());
    renderComponent();
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(hideModalSpy).toHaveBeenCalled();
  });
});
