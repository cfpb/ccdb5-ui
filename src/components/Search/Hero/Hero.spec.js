import { Hero } from './Hero';
import React from 'react';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { LINK_DATA_USE } from '../../../constants';
import * as viewActions from '../../../actions/view';

describe('Hero', () => {
  const renderComponent = () => {
    render(<Hero />);
  };

  test('rendering', () => {
    const showDialogSpy = jest
      .spyOn(viewActions, 'showMoreAboutDialog')
      .mockImplementation(() => jest.fn());

    renderComponent();
    const linkDialog = screen.getByText(
      'Things to know before you use this database'
    );
    expect(linkDialog).toBeInTheDocument();

    fireEvent.click(linkDialog);
    expect(showDialogSpy).toHaveBeenCalledTimes(1);

    const linkDataUse = screen.getByText('How we use complaint data');
    expect(linkDataUse).toBeInTheDocument();
    expect(linkDataUse).toHaveAttribute('href', LINK_DATA_USE);

    const linkTechDoc = screen.getByText('Technical documentation');
    expect(linkTechDoc).toBeInTheDocument();
    expect(linkTechDoc).toHaveAttribute(
      'href',
      'https://cfpb.github.io/api/ccdb/'
    );
  });
});
