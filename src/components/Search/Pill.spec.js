import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import * as filtersActions from '../../actions/filter';
import { merge } from '../../testUtils/functionHelpers';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultQuery } from '../../reducers/query/query';
import { Pill } from './Pill';

const renderComponent = (props, newAggsState = {}, newQueryState = {}) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
  };

  render(<Pill {...props} />, {
    preloadedState: data,
  });
};

describe('component::Pill', () => {
  const user = userEvent.setup({ delay: null });
  let dateRangeToggledFn, removeFilterFn, replaceFilterFn;

  beforeEach(() => {
    dateRangeToggledFn = jest.spyOn(filtersActions, 'dateRangeToggled');
    removeFilterFn = jest.spyOn(filtersActions, 'removeFilter');
    replaceFilterFn = jest.spyOn(filtersActions, 'replaceFilters');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render in initial state', () => {
    const props = {
      fieldName: 'issue',
      value: 'abc',
    };
    renderComponent(props);
    expect(screen.getByText('abc')).toBeInTheDocument();
  });

  it('should remove date_received field as a filter', async () => {
    const props = {
      fieldName: 'date_received',
      value: 'abc',
    };

    renderComponent(props);

    expect(screen.getByRole('button', { name: /abc/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /abc/ }));
    expect(dateRangeToggledFn).toHaveBeenCalledWith('All');
  });

  it('should replace issue filters', async () => {
    const props = {
      fieldName: 'issue',
      value: 'abc',
    };
    renderComponent(props);
    expect(screen.getByRole('button', { name: /abc/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /abc/ }));

    expect(replaceFilterFn).toHaveBeenCalledWith('issue', []);
  });

  it('should remove other filters', async () => {
    const props = {
      fieldName: 'foobar',
      value: 'abc',
    };
    renderComponent(props);
    expect(screen.getByRole('button', { name: /abc/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /abc/ }));

    expect(removeFilterFn).toHaveBeenCalledWith('foobar', 'abc');
  });
});
