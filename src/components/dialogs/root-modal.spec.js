import * as viewActions from '../../reducers/view/view-slice';
import { RootModal } from './root-modal';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../test-utils/test-utils';
import Modal from 'react-modal';

describe('RootModal', () => {
  it('does not render when closed', () => {
    const { container } = render(<RootModal />);
    Modal.setAppElement(container);

    expect(
      screen.queryByText('Things you should know before you use this database'),
    ).not.toBeInTheDocument();
  });

  it('renders MoreAbout dialog', () => {
    const closeSpy = jest
      .spyOn(viewActions, 'moreAboutModalHidden')
      .mockImplementation(() => jest.fn());
    const { container } = render(<RootModal />, {
      preloadedState: {
        view: {
          isMoreAboutModalOpen: true,
        },
      },
    });
    Modal.setAppElement(container);
    expect(
      screen.getByText('Things you should know before you use this database'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    expect(closeSpy).toHaveBeenCalled();
  });
});
