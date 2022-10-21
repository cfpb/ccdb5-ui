import React from 'react';
import * as types from '../../constants';
import { RootModal } from './RootModal';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import * as viewActions from '../../actions/view';
// import userEvent from '@testing-library/user-event';

describe('RootModal', () => {
  it('does not render modals initially', () => {
    render(<RootModal />);

    expect(
      screen.queryByText('Things you should know before you use this database')
    ).toBeNull();
    expect(screen.queryByText('Export complaints')).toBeNull();
  });

  it('renders Export dialog', () => {
    const closeSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    render(<RootModal />, {
      preloadedState: {
        view: {
          modalTypeShown: types.MODAL_TYPE_DATA_EXPORT,
        },
      },
    });
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(closeSpy).toHaveBeenCalled();
  });

  it('renders Export Confirmation dialog', () => {
    // const closeSpy = jest
    //   .spyOn(viewActions, 'hideModal')
    //   .mockImplementation(() => jest.fn());
    render(<RootModal />, {
      preloadedState: {
        view: {
          modalTypeShown: types.MODAL_TYPE_EXPORT_CONFIRMATION,
        },
      },
    });
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    // TODO: uncomment this out when we upgrade to react 18.
    // SEE https://github.com/testing-library/user-event/issues/969
    // userEvent.keyboard('{Escape}');
    // expect(closeSpy).toHaveBeenCalled();
  });

  it('renders MoreAbout dialog', () => {
    const closeSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    render(<RootModal />, {
      preloadedState: {
        view: {
          modalTypeShown: types.MODAL_TYPE_MORE_ABOUT,
        },
      },
    });
    expect(
      screen.getByText('Things you should know before you use this database')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(closeSpy).toHaveBeenCalled();
  });
});
