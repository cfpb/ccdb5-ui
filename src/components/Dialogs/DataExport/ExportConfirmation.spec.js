import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import * as viewActions from '../../../actions/view';
import { ExportConfirmation } from './ExportConfirmation';

describe('ExportConfirmation', () => {
  const renderComponent = () => {
    render(<ExportConfirmation />);
  };

  it('renders default state without crashing', async () => {
    const hideModalSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    renderComponent();
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    expect(hideModalSpy).toHaveBeenCalled();
  });
});
