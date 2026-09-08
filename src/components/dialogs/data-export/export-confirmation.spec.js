import { screen, testRender as render } from '../../../test-utils/test-utils';
import * as viewActions from '../../../reducers/view/view-slice';
import { ExportConfirmation } from './export-confirmation';
import userEvent from '@testing-library/user-event';

rs.useRealTimers();
describe('ExportConfirmation', () => {
  const user = userEvent.setup();
  const renderComponent = () => {
    render(<ExportConfirmation />);
  };

  it('renders default state without crashing', async () => {
    const hideModalSpy = rs
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => rs.fn());
    renderComponent();
    expect(screen.getByText('Download complaint data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Close/ }));
    expect(hideModalSpy).toHaveBeenCalled();
  });
});
