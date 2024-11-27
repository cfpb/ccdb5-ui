import { ExternalTooltip } from './ExternalTooltip';
import { merge } from '../../../testUtils/functionHelpers';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import * as filterActions from '../../../reducers/filters/filtersSlice';
import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

const renderComponent = (newTrendsState) => {
  merge(newTrendsState, trendsState);

  const data = {
    trends: newTrendsState,
  };

  render(<ExternalTooltip />, {
    preloadedState: data,
  });
};

jest.useRealTimers();

describe('component: ExternalTooltip', () => {
  const user = userEvent.setup();
  test('empty rendering', () => {
    renderComponent({});
    expect(screen.queryByText('foobar')).not.toBeInTheDocument();
  });
  test('rendering', () => {
    const trends = {
      focus: '',
      lens: '',
      tooltip: {
        title: 'Date Range: 1/1/1900 - 1/1/2000',
        total: 2900,
        values: [
          { colorIndex: 1, name: 'foo', value: 1000 },
          { colorIndex: 2, name: 'bar', value: 1000 },
          { colorIndex: 3, name: 'All other', value: 900 },
          { colorIndex: 4, name: "Eat at Joe's", value: 1000 },
        ],
      },
    };
    renderComponent(trends);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('Date Range:')).toBeInTheDocument();
    expect(screen.getByText('1/1/1900 - 1/1/2000')).toBeInTheDocument();
    expect(screen.getByText('900')).toBeInTheDocument();
  });

  test('rendering Company typeahead', async () => {
    const filterRemovedSpy = jest.spyOn(filterActions, 'filterRemoved');
    const trends = {
      focus: '',
      lens: 'Company',
      tooltip: {
        title: 'Date Range: 1/1/1900 - 1/1/2000',
        total: 2900,
        values: [
          { colorIndex: 1, name: 'foo', value: 1000 },
          { colorIndex: 2, name: 'bar', value: 1000 },
          { colorIndex: 3, name: 'All other', value: 900 },
          { colorIndex: 4, name: "Eat at Joe's", value: 1000 },
        ],
      },
    };
    renderComponent(trends);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter company name'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove foo from comparison set' }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Remove foo from comparison set' }),
    );
    expect(filterRemovedSpy).toHaveBeenCalledWith('company', 'foo');
  });

  test('hide Company typeahead in company Focus Mode', () => {
    const trends = {
      focus: 'Acme Foobar',
      lens: 'Company',
      tooltip: {
        title: 'Date Range: 1/1/1900 - 1/1/2000',
        total: 2900,
        values: [
          { colorIndex: 1, name: 'foo', value: 1000 },
          { colorIndex: 2, name: 'bar', value: 1000 },
          { colorIndex: 3, name: 'All other', value: 900 },
          { colorIndex: 4, name: "Eat at Joe's", value: 1000 },
        ],
      },
    };
    renderComponent(trends);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Enter company name'),
    ).not.toBeInTheDocument();
  });
});
