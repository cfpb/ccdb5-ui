import { PillPanel } from './PillPanel';
import { screen, testRender as render } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { filtersState } from '../../reducers/filters/filtersSlice';
import { queryState } from '../../reducers/query/querySlice';

const renderComponent = (newFiltersState) => {
  const newQueryState = {
    dateLastIndexed: '2025-01-01',
    date_received_max: '2020-05-05',
    date_received_min: '2017-05-05',
  };
  merge(newFiltersState, filtersState);
  merge(newQueryState, queryState);

  const data = {
    filters: newFiltersState,
    query: newQueryState,
  };
  render(<PillPanel />, {
    preloadedState: data,
  });
};
describe('component: PillPanel', () => {
  it('renders without crashing', () => {
    renderComponent({
      company: ['Apples', 'Bananas are great'],
      timely: ['Yes'],
    });
    expect(screen.getByText('Filters applied:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Date Received: 5\/5\/2017 - 5\/5\/2020/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Apples/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Bananas are great/,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Timely/,
      }),
    ).toBeInTheDocument();
  });

  it('adds a has narrative pill', () => {
    renderComponent({ has_narrative: true });
    expect(
      screen.getByRole('button', {
        name: /Has narrative/,
      }),
    ).toBeInTheDocument();
  });
});
