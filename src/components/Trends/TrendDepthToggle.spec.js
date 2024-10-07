import { TrendDepthToggle } from './TrendDepthToggle';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { defaultAggs } from '../../reducers/aggs/aggsSlice';
import { defaultQuery } from '../../reducers/query/query';
import { defaultTrends } from '../../reducers/trends/trends';
import * as trendsActions from '../../actions/trends';
import userEvent from '@testing-library/user-event';

const renderComponent = (newAggsState, newQueryState, newTrendsState) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);
  merge(newTrendsState, defaultTrends);
  const data = {
    aggs: newAggsState,
    query: newQueryState,
    trends: newTrendsState,
  };
  render(<TrendDepthToggle />, { preloadedState: data });
};

jest.useRealTimers();

describe('component:TrendDepthToggle', () => {
  const user = userEvent.setup();
  let depthChangedSpy, depthResetSpy;
  beforeEach(() => {
    depthChangedSpy = jest
      .spyOn(trendsActions, 'changeDepth')
      .mockImplementation(() => jest.fn());
    depthResetSpy = jest
      .spyOn(trendsActions, 'resetDepth')
      .mockImplementation(() => jest.fn());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('does not render on Focus page', () => {
    renderComponent({}, { focus: 'Foo bar' }, {});
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
  });

  it('does not render when lens is Overview', () => {
    renderComponent({}, { lens: 'Overview' }, {});
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
  });

  it('renders Product view more link', async () => {
    renderComponent(
      {
        product: [
          { name: 'a', visible: true },
          { name: 'b', visible: true },
          { name: 'c', visible: true },
          { name: 'd', visible: true },
          { name: 'e', visible: true },
          { name: 'f', visible: true },
          { name: 'g', visible: true },
          { name: 'h', visible: true },
        ],
      },
      { lens: 'Product', product: [] },
      {},
    );
    expect(
      screen.getByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show more' }));
    expect(depthChangedSpy).toHaveBeenCalledWith(13);
  });

  it('renders Product view less link', async () => {
    renderComponent(
      {
        product: [
          { name: 'a', visible: true },
          { name: 'b', visible: true },
          { name: 'c', visible: true },
          { name: 'd', visible: true },
          { name: 'e', visible: true },
          { name: 'f', visible: true },
          { name: 'g', visible: true },
          { name: 'h', visible: true },
        ],
      },
      { lens: 'Product' },
      {
        results: {
          product: [
            { name: 'a', visible: true, isParent: true },
            { name: 'b', visible: true, isParent: true },
            { name: 'c', visible: true, isParent: true },
            { name: 'd', visible: true, isParent: true },
            { name: 'e', visible: true, isParent: true },
            { name: 'f', visible: true, isParent: true },
            { name: 'g', visible: true, isParent: true },
            { name: 'h', visible: true, isParent: true },
          ],
        },
      },
    );
    expect(
      screen.getByRole('button', { name: 'Show less' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show less' }));
    expect(depthResetSpy).toHaveBeenCalled();
  });

  it('renders Company view more link', async () => {
    renderComponent(
      {
        company: [
          { name: 'a', visible: true },
          { name: 'b', visible: true },
          { name: 'c', visible: true },
          { name: 'd', visible: true },
          { name: 'e', visible: true },
          { name: 'f', visible: true },
          { name: 'g', visible: true },
          { name: 'h', visible: true },
        ],
      },
      { company: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], lens: 'Company' },
      {},
    );
    expect(
      screen.getByRole('button', { name: 'Show more' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show more' }));
    expect(depthChangedSpy).toHaveBeenCalledWith(13);
  });

  it('renders Company view less link', async () => {
    renderComponent(
      {
        company: [
          { name: 'a', visible: true },
          { name: 'b', visible: true },
          { name: 'c', visible: true },
          { name: 'd', visible: true },
          { name: 'e', visible: true },
          { name: 'f', visible: true },
          { name: 'g', visible: true },
          { name: 'h', visible: true },
        ],
      },
      {
        company: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        lens: 'Company',
      },
      {
        results: {
          company: [
            { name: 'a', visible: true, isParent: true },
            { name: 'b', visible: true, isParent: true },
            { name: 'c', visible: true, isParent: true },
            { name: 'd', visible: true, isParent: true },
            { name: 'e', visible: true, isParent: true },
            { name: 'f', visible: true, isParent: true },
            { name: 'g', visible: true, isParent: true },
            { name: 'h', visible: true, isParent: true },
          ],
        },
      },
    );
    expect(
      screen.getByRole('button', { name: 'Show less' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show less' }));
    expect(depthResetSpy).toHaveBeenCalled();
  });
});
