import { testRender as render, screen } from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
//import userEvent from '@testing-library/user-event';
import { LineChart } from './LineChart';
import { defaultTrends } from '../../../reducers/trends/trends';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';

// import * as d3 from 'd3';
// jest.mock('d3');
//import * as trendsActions from '../../../actions/trends';

/*const testTrendsState = {
  colorMap: { Complaints: '#ADDC91', Other: '#a2a3a4' },
  tooltip: false,
  results: {
    dateRangeLine: {
      dataByTopic: [
        {
          topic: 'Complaints',
          topicName: 'Complaints',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-02-01T00:00:00.000Z', value: 29068 },
            { date: '2020-03-01T00:00:00.000Z', value: 35112 },
            { date: '2020-04-01T00:00:00.000Z', value: 54345 },
            { date: '2020-05-01T00:00:00.000Z', value: 7678 },
            { date: '2020-06-01T00:00:00.000Z', value: 9821 },
          ],
        },
      ],
    },
  },
};

const testQueryState = {
  lens: 'Overview',
  dateInterval: 'Month',
  date_received_min: new Date('2020-01-01T00:00:00.000Z'),
  date_received_max: new Date('2020-12-01T00:00:00.000Z'),
};

const testViewState = {
  isPrintMode: true,
};*/

const renderComponent = (queryState, trendsState, viewState) => {
  merge(queryState, defaultQuery);
  merge(trendsState, defaultTrends);
  merge(viewState, defaultView);

  const data = {
    query: queryState,
    trends: trendsState,
    view: viewState,
  };

  render(<LineChart />, {
    preloadedState: data,
  });
};

describe('component: LineChart', () => {
  //let updateTrendsTooltipFn;

  beforeEach(() => {
    jest.resetAllMocks();
    //updateTrendsTooltipFn = jest.spy(trendsActions, 'updateTrendsTooltip');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // describe('initial state', () => {
  it.only('should render Overview chart with data', async () => {
    const newTrendsState = {
      colorMap: {
        Complaints: '#20aa3f',
        Other: '#a2a3a4',
        'All other products': '#a2a3a4',
        'All other companies': '#a2a3a4',
        'All other values': '#a2a3a4',
      },
      results: {
        dateRangeLine: {
          dataByTopic: [
            {
              topic: 'Complaints',
              topicName: 'Complaints',
              dashed: false,
              show: true,
              dates: [
                { date: '2024-05-01T00:00:00.000Z', value: 225171 },
                { date: '2024-06-01T00:00:00.000Z', value: 225171 },
                { date: '2024-07-01T00:00:00.000Z', value: 225171 },
                { date: '2024-08-01T00:00:00.000Z', value: 198483 },
              ],
            },
          ],
        },
      },
    };
    const newQueryState = {
      dateInterval: 'Month',
      date_received_max: new Date('2024-09-02T07:00:00.000Z'),
      date_received_min: new Date('2024-03-02T08:00:00.000Z'),
      lens: 'Overview',
    };

    renderComponent(newQueryState, newTrendsState, {});
    await expect(screen.getByText('Complaints')).toBeInTheDocument();
    expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
    //verify width, since its calculation is determined by lens type
    /*       expect(
        component.container.querySelector('#line-chart').getBoundingClientRect()
          .width,
      ).toBe(750); */
  });
  //
  //   it('should render non-Overview chart in print mode, with equal last line date', () => {
  //     /*const component = renderComponent();
  //     expect(screen.getByText('Complaints')).toBeInTheDocument();
  //     expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  //     //verify width, since its calculation is determined by lens type
  //     expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).toBe(500);
  //     expect(updateTrendsTooltipFn).not.toHaveBeenCalled();*/
  //   });
  //
  //   it('should render non-Overview chart in print mode, without equal last line date', () => {
  //     /*const component = renderComponent();
  //     expect(screen.getByText('Complaints')).toBeInTheDocument();
  //     expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  //     //verify width, since its calculation is determined by lens type
  //     expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).toBe(500);
  //     expect(updateTrendsTooltipFn).toHaveBeenCalledWith();*/
  //   });
  //
  //   it('should render non-Overview chart not in print mode', () => {
  //     /**
  //      * const component = renderComponent();
  //     expect(screen.getByText('Complaints')).toBeInTheDocument();
  //     expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
  //     //verify width, since its calculation is determined by lens type
  //     expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).not.toBe(500);
  //     expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).not.toBe(750);
  //      */
  //   });
  //
  //   it('should render with expected error message when no data is present', () => {
  //     const noTrends = {};
  //     renderComponent(noTrends);
  //
  //     expect(
  //       screen.getByText(
  //         'Cannot display chart. Adjust your date range or date interval.',
  //       ),
  //     ).toBeInTheDocument();
  //   });
  // });
  //
  // describe('tooltip actions', () => {
  //   it('should show tooltip for Overview charts', () => {
  //     //use test data for Overview chart test (with tooltip data) in initial states section
  //     //do mouseover to  show tooltip
  //     //verify that tooltip is shown
  //   });
  //
  //   it('should update tooltip for Overview charts', () => {
  //     //use test data for Overview chart test (with tooltip data) in initial states section,  with tooltip initially shown
  //     //do mousemove to  update tooltip
  //     //verify that tooltip is shown with updated data
  //   });
  //
  //   it('should hide tooltip for Overview charts', () => {
  //     //use test data for Overview chart test (with tooltip data) in initial states section,  with tooltip initially shown
  //     //do mouseout
  //     //verify that tooltip is hidden
  //   });
  //
  //   it('should show tooltip for non-Overview charts, with equal dates', () => {
  //     //use test data for non-Overview chart with equal dates (with tooltip data) in initial state
  //     //do mousemove to trigger update
  //     //expect(updateTrendsTooltipFn).not.toHaveBeenCalled()
  //   });
  //
  //   it('should show tooltip for non-Overview charts, with non-equal dates', () => {
  //     //use test data for non-Overview chart with non equal dates (with tooltip data) in initial state
  //     //do mousemove to trigger update
  //     //expect(updateTrendsTooltipFn).toHaveBeenCalledWith(TBD params)
  //   });
  // });
});
