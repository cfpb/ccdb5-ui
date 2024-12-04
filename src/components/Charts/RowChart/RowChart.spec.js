import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { merge } from '../../../testUtils/functionHelpers';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import { RowChart } from './RowChart';
import { MODE_TRENDS } from '../../../constants';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../../List/ListPanel/fixture';

const renderComponent = (props, newTrendState, newViewState) => {
  merge(newTrendState, trendsState);
  merge(newViewState, viewState);

  const data = {
    routes: { queryString: '?Sadfa=dsfds' },
    trends: newTrendState,
    view: newViewState,
  };

  return render(<RowChart {...props} />, {
    preloadedState: data,
  });
};

jest.mock('d3');

/**
 * NOTE: Britecharts and D3 are being mocked out, due to rendering issues with these libraries in JSDOM.
 * As a result, toggle states cannot be tested, and code coverage will not be 100%.
 */
describe('component::RowChart', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.resetAllMocks();

    const fakeD3 = buildFluentMock({ height: 50 });
    // how we add our own implementation of d3
    // override this so it doesn't crash. we test implementation elsewhere.
    jest.spyOn(d3, 'select').mockImplementation(fakeD3);
    jest.spyOn(d3, 'selectAll').mockImplementation(fakeD3);
  });

  it('should render all data when not in print mode', () => {
    const props = {
      data: [
        { name: 'Category 1', isParent: true, value: 300 },
        { name: 'Category 2', isParent: true, value: 300 },
        { name: 'Category 3', isParent: true, value: 400 },
      ],
      id: 'foo',
      colorScheme: [],
      title: 'Chart Title',
      helperText: 'Description of the chart',
      total: 1000,
    };

    const trends = {
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
      expandedRows: [],
      view: MODE_TRENDS,
      width: 1000,
    };
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent(props, trends, view);

    expect(screen.getByRole('heading')).toHaveTextContent(props.title);
    expect(screen.getByText(props.helperText)).toBeInTheDocument();
  });

  it('should render data without "Visualize trends" banner when in print mode', () => {
    const props = {
      data: [
        { name: 'Visualize trends for' },
        { name: 'Category 1', isParent: true, value: 300 },
        { name: 'Category 2', isParent: true, value: 300 },
        { name: 'Category 3', isParent: true, value: 400 },
      ],
      id: 'foo',
      colorScheme: [],
      title: 'Chart Title',
      helperText: 'Description of the chart',
      total: 1000,
    };

    const trends = {
      lens: 'Foo',
    };

    const view = {
      isPrintMode: true,
      expandedRows: [],
      view: MODE_TRENDS,
      width: 1000,
    };
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent(props, trends, view);

    expect(screen.getByRole('heading')).toHaveTextContent(props.title);
    expect(screen.getByText(props.helperText)).toBeInTheDocument();

    //expect 1st data name not to be in document
    //expect all other data names to be in document
  });

  it('should still render with title and helper text even when no data is present', () => {
    const props = {
      data: [],
      id: 'foo',
      colorScheme: [],
      title: 'Chart Title',
      helperText: 'Description of the chart',
      total: 1000,
    };
    const trends = {
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
      expandedRows: [],
      view: MODE_TRENDS,
      width: 1000,
    };
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent(props, trends, view);
    expect(screen.getByRole('heading')).toHaveTextContent(props.title);
    expect(screen.getByText(props.helperText)).toBeInTheDocument();
  });

  it('should render as null when no total is present', () => {
    const props = {
      data: [],
      id: 'foo',
      colorScheme: [],
      title: 'Chart Title',
      helperText: 'Description of the chart',
      total: 0,
    };

    const trends = {
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
      expandedRows: [],
      view: MODE_TRENDS,
      width: 1000,
    };
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    const { container } = renderComponent(props, trends, view);
    expect(container.firstChild).not.toBeInTheDocument();
  });
});
