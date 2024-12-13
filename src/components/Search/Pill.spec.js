import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import * as filtersActions from '../../reducers/filters/filtersSlice';
import * as queryActions from '../../reducers/query/querySlice';
import { merge } from '../../testUtils/functionHelpers';
import { Pill } from './Pill';
import { filtersState } from '../../reducers/filters/filtersSlice';

const renderComponent = (props, newFiltersState = {}) => {
  merge(newFiltersState, filtersState);

  const data = {
    filters: newFiltersState,
  };

  render(<Pill {...props} />, {
    preloadedState: data,
  });
};

describe('component::Pill', () => {
  const user = userEvent.setup({ delay: null });
  let dateRangeToggledFn, removeFilterFn, replaceFilterFn;

  beforeEach(() => {
    dateRangeToggledFn = jest.spyOn(queryActions, 'dateRangeChanged');
    removeFilterFn = jest.spyOn(filtersActions, 'filterRemoved');
    replaceFilterFn = jest.spyOn(filtersActions, 'filtersReplaced');
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
