import { CompanyReceivedFilter } from './CompanyReceivedFilter';
import { merge } from '../../../testUtils/functionHelpers';
import { queryState } from '../../../reducers/query/querySlice';
import * as filterActions from '../../../reducers/query/querySlice';
import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

const renderComponent = (newQueryState) => {
  merge(newQueryState, queryState);

  const data = {
    query: newQueryState,
  };
  render(<CompanyReceivedFilter />, { preloadedState: data });
};

jest.useRealTimers();

describe('component::CompanyReceivedFilter', () => {
  const user = userEvent.setup();
  const companyReceivedDateUpdatedSpy = jest.spyOn(
    filterActions,
    'companyReceivedDateChanged',
  );
  it('Renders', async () => {
    renderComponent({});
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('Through')).toBeInTheDocument();

    await user.type(screen.getByLabelText('From'), '2018-09-03{Enter}');
    // expect(screen.getByText())
    expect(companyReceivedDateUpdatedSpy).toHaveBeenCalledWith(
      '2018-09-03',
      '',
    );

    await user.type(screen.getByLabelText('Through'), '2021-09-03{Enter}');
    expect(companyReceivedDateUpdatedSpy).toHaveBeenCalledWith(
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
