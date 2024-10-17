import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as viewActions from '../../../reducers/view/viewSlice';
import { ExportConfirmation } from './ExportConfirmation';
import userEvent from '@testing-library/user-event';

jest.useRealTimers();
describe('ExportConfirmation', () => {
  const user = userEvent.setup();
  const renderComponent = () => {
    render(<ExportConfirmation />);
  };

  it('renders default state without crashing', async () => {
    const hideModalSpy = jest
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => jest.fn());
    renderComponent();
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Close/ }));
    expect(hideModalSpy).toHaveBeenCalled();
  });
});
