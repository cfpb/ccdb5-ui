import { CompanyReceivedFilter } from './CompanyReceivedFilter';
import React from 'react';
import { merge } from '../../testUtils/functionHelpers';
import { filtersState } from '../../reducers/filters/filtersSlice';
import * as filterActions from '../../reducers/filters/filtersSlice';
import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

const renderComponent = (newFiltersState) => {
  merge(newFiltersState, filtersState);

  const data = {
    filters: newFiltersState,
  };
  render(<CompanyReceivedFilter />, { preloadedState: data });
};

jest.useRealTimers();

describe('component::CompanyReceivedFilter', () => {
  const user = userEvent.setup();
  const companyReceivedDateUpdatedSpy = jest.spyOn(
    filterActions,
    'companyReceivedDateUpdated',
  );
  it('Renders', async () => {
    renderComponent({});
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('Through')).toBeInTheDocument();

    await user.type(screen.getByLabelText('From'), '2018-09-03{Enter}');
    // expect(screen.getByText())
    expect(companyReceivedDateUpdatedSpy).toHaveBeenCalledWith(
      'company_received',
      '2018-09-03',
      '',
    );

    await user.type(screen.getByLabelText('Through'), '2021-09-03{Enter}');
    expect(companyReceivedDateUpdatedSpy).toHaveBeenCalledWith(
      'company_received',
      '2018-09-03',
      '2021-09-03',
    );
  });

  it('shows errors', () => {
    renderComponent({
      company_received_min: '09-23-2020',
      company_received_max: '09-23-2017',
    });
    expect(
      screen.getByText("'From' date must be less than 'through' date"),
    ).toBeInTheDocument();
  });
});
