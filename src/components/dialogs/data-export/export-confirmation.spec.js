import { screen, testRender as render } from '../../../test-utils/test-utils';
import * as viewActions from '../../../reducers/view/view-slice';
import { ExportConfirmation } from './export-confirmation';
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
