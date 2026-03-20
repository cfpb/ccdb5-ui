import { Hero } from './Hero';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../testUtils/test-utils';
import { LINK_DATA_USE, MODAL_TYPE_MORE_ABOUT } from '../../../constants';
import * as viewActions from '../../../reducers/view/viewSlice';

describe('Hero', () => {
  const renderComponent = () => {
    render(<Hero />);
  };

  test('rendering', () => {
    const showDialogSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());

    renderComponent();
    const linkDialog = screen.getByRole('button', {
      name: 'Things to know before you use this database',
    });
    expect(linkDialog).toBeInTheDocument();

    fireEvent.click(linkDialog);
    expect(showDialogSpy).toHaveBeenCalledWith(MODAL_TYPE_MORE_ABOUT);

    const linkDataUse = screen.getByRole('link', {
      name: 'How we use complaint data',
    });
    expect(linkDataUse).toBeInTheDocument();
    expect(linkDataUse).toHaveAttribute('href', LINK_DATA_USE);

    const linkTechDoc = screen.getByRole('link', {
      name: 'Technical documentation',
    });
    expect(linkTechDoc).toBeInTheDocument();
    expect(linkTechDoc).toHaveAttribute(
      'href',
      'https://cfpb.github.io/api/ccdb/',
    );
  });
});
