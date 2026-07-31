import { screen, testRender as render } from '../../../test-utils/test-utils';
import { merge } from '../../../test-utils/function-helpers';
import { queryState } from '../../../reducers/query/query-slice';
import { DateFilter } from './date-filter';

const renderComponent = (newQueryState = {}) => {
  merge(newQueryState, queryState);

  render(<DateFilter />, {
    preloadedState: {
      query: newQueryState,
    },
  });
};

describe('component::DateFilter', () => {
  it('should render title and date inputs', () => {
    renderComponent({
      date_received_min: new Date('2017-05-05T04:00:00.000Z'),
      date_received_max: new Date('2020-05-05T04:00:00.000Z'),
    });

    expect(
      screen.getByRole('heading', {
        name: 'The date the CFPB received the complaint',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('should render errors when from date is after to date', () => {
    renderComponent({
      date_received_max: new Date('2017-05-05T04:00:00.000Z'),
      date_received_min: new Date('2020-05-05T04:00:00.000Z'),
    });

    expect(
      screen.getByText("'From' date must be less than 'To' date"),
    ).toBeInTheDocument();
  });
});
