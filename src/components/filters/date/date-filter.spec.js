import { screen, testRender as render } from '../../../test-utils/test-utils';
import { merge } from '../../../test-utils/function-helpers';
import { queryState } from '../../../reducers/query/query-slice';
import { DateFilter } from './date-filter';

const renderComponent = (newQueryState = {}) => {
  merge(newQueryState, queryState);

  const data = {
    query: newQueryState,
  };

  render(<DateFilter />, {
    preloadedState: data,
  });
};

describe('component::DateFilter', () => {
  it('should render initial state', () => {
    const query = {
      date_received_min: new Date('2017-05-05T04:00:00.000Z'),
      date_received_max: new Date('2020-05-05T04:00:00.000Z'),
    };

    renderComponent(query);
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('should render initial state with errors', () => {
    const query = {
      date_received_max: new Date('2017-05-05T04:00:00.000Z'),
      date_received_min: new Date('2020-05-05T04:00:00.000Z'),
    };

    renderComponent(query);

    expect(
      screen.getByText("'From' date must be less than 'To' date"),
    ).toBeInTheDocument();
  });
});
