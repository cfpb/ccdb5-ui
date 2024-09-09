import { testRender as render, screen } from '../../../testUtils/test-utils';
import * as d3 from 'd3';
import { buildFluentMock } from '../__fixtures__/buildFluentMock';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultAggs } from '../../../reducers/aggs/aggs';
import { defaultView } from '../../../reducers/view/view';
import { defaultQuery } from '../../../reducers/query/query';
import { RowChart } from './RowChart';

const renderComponent = (props, newAggsState, newQueryState, newViewState) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);
  merge(newViewState, defaultView);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
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

    const aggs = {};

    const query = {
      tab: 'Trends',
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
      expandedRows: [],
      width: 1000,
    };

    renderComponent(props, aggs, query, view);

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

    const aggs = {};

    const query = {
      tab: 'Trends',
      lens: 'Foo',
    };

    const view = {
      isPrintMode: true,
      expandedRows: [],
      width: 1000,
    };

    renderComponent(props, aggs, query, view);

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

    const aggs = {};

    const query = {
      tab: 'Trends',
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
      expandedRows: [],
      width: 1000,
    };

    renderComponent(props, aggs, query, view);
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

    const aggs = {};

    const query = {
      tab: 'Trends',
      lens: 'Foo',
    };

    const view = {
      isPrintMode: false,
      expandedRows: [],
      width: 1000,
    };

    const { container } = renderComponent(props, aggs, query, view);
    expect(container.firstChild).toBeNull();
  });
});
