import { CompanyReceivedFilter, coerceDates } from './company-received-filter';
import { maxDate, minDate } from '../../../constants';
import { merge } from '../../../test-utils/function-helpers';
import * as filterActions from '../../../reducers/query/query-slice';
import { queryState } from '../../../reducers/query/query-slice';
import { screen, testRender as render } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';

const renderComponent = (newQueryState) => {
  merge(newQueryState, queryState);

  const data = {
    query: newQueryState,
  };
  render(<CompanyReceivedFilter />, { preloadedState: data });
};

rs.useRealTimers();

describe('component::CompanyReceivedFilter', () => {
  const user = userEvent.setup();
  const companyReceivedDateUpdatedSpy = rs.spyOn(
    filterActions,
    'companyReceivedDateChanged',
  );
  it('Renders', async () => {
    renderComponent({});
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();

    await user.type(screen.getByLabelText('From'), '2018-09-03{Enter}');
    // expect(screen.getByText())
    expect(companyReceivedDateUpdatedSpy).toHaveBeenCalledWith(
      '2018-09-03',
      maxDate,
    );
  });

  it('shows errors', () => {
    renderComponent({
      company_received_min: '09-23-2020',
      company_received_max: '09-23-2017',
    });
    expect(
      screen.getByText("'From' date must be less than 'To' date"),
    ).toBeInTheDocument();
  });

  it('coerces when no from', () => {
    const [from, to] = coerceDates(null, '2022-11-11');
    expect(from).toBe(minDate);
    expect(to).toBe('2022-11-11');
  });

  it('coerces when bad from', () => {
    const [from, to] = coerceDates('1900-01-01', '2022-11-11');
    expect(from).toBe(minDate);
    expect(to).toBe('2022-11-11');
  });

  it('coerces when no to', () => {
    const [from, to] = coerceDates('2022-11-11', null);
    expect(from).toBe('2022-11-11');
    expect(to).toBe(maxDate);
  });

  it('coerces when bad to', () => {
    const [from, to] = coerceDates('2022-11-11', '2050-11-11');
    expect(from).toBe('2022-11-11');
    expect(to).toBe(maxDate);
  });
});
