import React from 'react';
import * as types from '../../constants';
import * as viewActions from '../../actions/view';
import { RootModal } from './RootModal';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import Modal from 'react-modal';
import { waitFor } from '@testing-library/react';

describe('RootModal', () => {
  it('does not render modals initially', () => {
    const { container } = render(<RootModal />);
    Modal.setAppElement(container);

    expect(
      screen.queryByText('Things you should know before you use this database'),
    ).toBeNull();
    expect(screen.queryByText('Export complaints')).toBeNull();
  });

  it('renders Export dialog', () => {
    const closeSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    const { container } = render(<RootModal />, {
      preloadedState: {
        view: {
          modalTypeShown: types.MODAL_TYPE_DATA_EXPORT,
        },
      },
    });
    Modal.setAppElement(container);
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    expect(closeSpy).toHaveBeenCalled();
  });

  it('renders Export Confirmation dialog', async () => {
    const closeSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    const { container } = render(<RootModal />, {
      preloadedState: {
        view: {
          modalTypeShown: types.MODAL_TYPE_EXPORT_CONFIRMATION,
        },
      },
    });

    Modal.setAppElement(container);
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  it('renders MoreAbout dialog', () => {
    const closeSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    const { container } = render(<RootModal />, {
      preloadedState: {
        view: {
          modalTypeShown: types.MODAL_TYPE_MORE_ABOUT,
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
