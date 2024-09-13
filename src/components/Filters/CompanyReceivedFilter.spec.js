import { testRender as render, screen } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { defaultQuery } from '../../reducers/query/query';
import { CompanyReceivedFilter } from './CompanyReceivedFilter';

const renderComponent = (newQueryState = {}) => {
  merge(newQueryState, defaultQuery);

  const data = {
    query: newQueryState,
  };

  render(<CompanyReceivedFilter />, {
    preloadedState: data,
  });
};

describe('component::CompanyReceivedFilter', () => {
  it('should render initial state', () => {
    const query = {
      company_received_min: new Date(2000, 0, 1),
      company_received_max: new Date(2016, 0, 1),
    };
    renderComponent(query);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('Through')).toBeInTheDocument();
  });

  it('should render initial state with errors', () => {
    const query = {
      company_received_max: new Date(2000, 0, 1),
      company_received_min: new Date(2016, 0, 1),
    };
    renderComponent(query);
    expect(
      screen.getByText("'From' date must be less than 'through' date"),
    ).toBeInTheDocument();
  });
});
