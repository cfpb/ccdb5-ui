import { PillPanel } from './PillPanel';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { defaultQuery } from '../../reducers/query/query';

const renderComponent = (newQueryState) => {
  merge(newQueryState, defaultQuery);

  const data = {
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
