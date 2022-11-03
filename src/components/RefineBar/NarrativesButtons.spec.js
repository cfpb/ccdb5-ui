import React from 'react';
import { NarrativesButtons } from './NarrativesButtons';
import * as filterActions from '../../actions/filter';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { defaultQuery } from '../../reducers/query/query';

describe('NarrativesButtons', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = (newQueryState) => {
    merge(newQueryState, defaultQuery);
    const data = {
      query: newQueryState,
    };

    render(<NarrativesButtons />, {
      preloadedState: data,
    });
  };

  it('should render default state', () => {
    const addFilterSpy = jest
      .spyOn(filterActions, 'addFilter')
      .mockImplementation(() => jest.fn());
    const removeFilterSpy = jest
      .spyOn(filterActions, 'removeFilter')
      .mockImplementation(() => jest.fn());

    renderComponent({});

    expect(screen.getByText('Read')).toBeInTheDocument();
    const btnAllComplaints = screen.getByLabelText('Show all complaints');
    expect(btnAllComplaints).toBeInTheDocument();
    expect(btnAllComplaints).toBeDisabled();
    expect(btnAllComplaints).toHaveClass('selected');
    fireEvent.click(btnAllComplaints);
    expect(addFilterSpy).toHaveBeenCalledTimes(0);
    expect(removeFilterSpy).toHaveBeenCalledTimes(0);

    const btnNarratives = screen.getByLabelText(
      'Show only complaints with narratives'
    );
    expect(btnNarratives).toBeInTheDocument();
    expect(btnNarratives).toBeEnabled();
    fireEvent.click(btnNarratives);
    expect(addFilterSpy).toHaveBeenCalledTimes(1);
  });

  it('should render has_narrative state', () => {
    const addFilterSpy = jest
      .spyOn(filterActions, 'addFilter')
      .mockImplementation(() => jest.fn());
    const removeFilterSpy = jest
      .spyOn(filterActions, 'removeFilter')
      .mockImplementation(() => jest.fn());

    renderComponent({ has_narrative: true });
    expect(screen.getByText('Read')).toBeInTheDocument();

    const btnNarratives = screen.getByLabelText(
      'Show only complaints with narratives'
    );
    expect(btnNarratives).toBeInTheDocument();
    expect(btnNarratives).toBeDisabled();
    expect(btnNarratives).toHaveClass('selected');
    fireEvent.click(btnNarratives);
    expect(addFilterSpy).toHaveBeenCalledTimes(0);
    expect(removeFilterSpy).toHaveBeenCalledTimes(0);

    const btnAllComplaints = screen.getByLabelText('Show all complaints');
    expect(btnAllComplaints).toBeInTheDocument();
    expect(btnAllComplaints).toBeEnabled();

    fireEvent.click(btnAllComplaints);
    expect(addFilterSpy).toHaveBeenCalledTimes(0);
    expect(removeFilterSpy).toHaveBeenCalledTimes(1);
  });
});
