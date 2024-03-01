import React from 'react';
import { PerCapita } from './PerCapita';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { queryState } from '../../reducers/query/query';
import { GEO_NORM_NONE, GEO_NORM_PER1000 } from '../../constants';
import * as mapActions from '../../reducers/query/query';

describe('PerCapita', () => {
  const renderComponent = (newQueryState) => {
    merge(newQueryState, queryState);
    const data = {
      query: newQueryState,
    };

    render(<PerCapita />, {
      preloadedState: data,
    });
  };

  it('should render', () => {
    renderComponent({
      dataNormalization: GEO_NORM_NONE,
      enablePer1000: false,
    });
    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });

    expect(buttonComplaints).toBeInTheDocument();
    expect(buttonComplaints).toBeDisabled();
    expect(buttonComplaints).toHaveClass('selected');
    expect(
      screen.getByRole('button', {
        name: 'Display map by complaints per 1,000 people',
      }),
    ).toBeInTheDocument();
  });

  it('renders dataNormalizationChanged GEO_NORM_NONE and handles action', () => {
    const dataNormalizationSpy = jest
      .spyOn(mapActions, 'updateDataNormalization')
      .mockImplementation(() => jest.fn());

    renderComponent({
      dataNormalization: GEO_NORM_PER1000,
      enablePer1000: false,
    });
    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });
    expect(buttonComplaints).toBeInTheDocument();
    expect(buttonComplaints).toBeEnabled();

    const buttonPer1000 = screen.getByRole('button', {
      name: 'Display map by complaints per 1,000 people',
    });
    expect(buttonPer1000).toBeInTheDocument();
    expect(buttonPer1000).toBeDisabled();
    expect(buttonPer1000).toHaveClass('a-btn__disabled');
    // make sure action doesn't fire since its disabled
    fireEvent.click(buttonPer1000);
    expect(dataNormalizationSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(buttonComplaints);
    expect(dataNormalizationSpy).toHaveBeenCalledWith(GEO_NORM_NONE);
  });

  it('renders dataNormalizationChanged GEO_NORM_PER1000 and handles action', () => {
    const dataNormalizationSpy = jest
      .spyOn(mapActions, 'updateDataNormalization')
      .mockImplementation(() => jest.fn());

    renderComponent({
      dataNormalization: GEO_NORM_NONE,
      enablePer1000: true,
    });

    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });

    expect(buttonComplaints).toBeInTheDocument();
    expect(buttonComplaints).toBeDisabled();

    fireEvent.click(buttonComplaints);
    expect(dataNormalizationSpy).toHaveBeenCalledTimes(0);

    const buttonPer1000 = screen.getByRole('button', {
      name: 'Display map by complaints per 1,000 people',
    });
    expect(buttonPer1000).toBeInTheDocument();
    expect(buttonPer1000).toBeEnabled();
    // make sure action doesn't fire since its disabled
    fireEvent.click(buttonPer1000);
    expect(dataNormalizationSpy).toHaveBeenCalledTimes(1);
  });

  it('renders GEO_NORM_PER1000 selected state and does nothing', () => {
    const dataNormalizationSpy = jest
      .spyOn(mapActions, 'updateDataNormalization')
      .mockImplementation(() => jest.fn());

    renderComponent({
      dataNormalization: GEO_NORM_PER1000,
      enablePer1000: true,
    });

    const buttonComplaints = screen.getByRole('button', {
      name: 'Display map by complaints',
    });

    expect(buttonComplaints).toBeInTheDocument();

    const buttonPer1000 = screen.getByRole('button', {
      name: 'Display map by complaints per 1,000 people',
    });
    expect(buttonPer1000).toBeInTheDocument();
    expect(buttonPer1000).toHaveClass('selected');
    expect(buttonPer1000).toBeDisabled();
    // make sure action doesn't fire since its disabled
    fireEvent.click(buttonPer1000);
    expect(dataNormalizationSpy).toHaveBeenCalledTimes(0);
  });
});
