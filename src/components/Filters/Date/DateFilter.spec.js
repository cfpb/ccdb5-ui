import { testRender as render, screen } from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { queryState } from '../../../reducers/query/querySlice';
import { DateFilter } from './DateFilter';

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
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    expect(
      screen.getByText(
        'CFPB updated product and issue options in April 2017 and August 2023.',
      ),
    ).toBeInTheDocument();
  });

  it('should render initial state with errors', () => {
    const query = {
      date_received_max: new Date('2017-05-05T04:00:00.000Z'),
      date_received_min: new Date('2020-05-05T04:00:00.000Z'),
    };

    renderComponent(query);

    expect(
      screen.getByText("'From' date must be less than 'through' date"),
    ).toBeInTheDocument();
  });
});
