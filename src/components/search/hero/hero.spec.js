import { Hero } from './hero';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { LINK_DATA_USE } from '../../../constants';
import * as viewActions from '../../../reducers/view/view-slice';

describe('Hero', () => {
  const renderComponent = () => {
    render(<Hero />);
  };

  test('rendering', () => {
    const showDialogSpy = jest
      .spyOn(viewActions, 'moreAboutModalShown')
      .mockImplementation(() => jest.fn());

    renderComponent();
    const linkDialog = screen.getByRole('button', {
      name: 'Things to know before you use this database',
    });
    expect(linkDialog).toBeInTheDocument();

    fireEvent.click(linkDialog);
    expect(showDialogSpy).toHaveBeenCalled();

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
