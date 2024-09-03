import { testRender as render, screen } from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
//import userEvent from '@testing-library/user-event';
import { LineChart } from './LineChart';
import { defaultTrends } from '../../../reducers/trends/trends';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';
//import * as trendsActions from '../../../actions/trends';

const testTrendsState = {
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
};

const renderComponent = (
  trendsState = testTrendsState,
  queryState = testQueryState,
  viewState = testViewState,
) => {
  merge(trendsState, defaultTrends);
  merge(queryState, defaultQuery);
  merge(viewState, defaultView);

  const data = {
    trends: trendsState,
    query: queryState,
    view: viewState,
  };

  return render(<LineChart />, {
    preloadedState: data,
  });
};

describe('component: LineChart', () => {
  //let updateTrendsTooltipFn;

  beforeEach(() => {
    //updateTrendsTooltipFn = jest.spy(trendsActions, 'updateTrendsTooltip');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should render Overview chart with data', () => {
      /*const trendsData = {
        tooltip: false,
        colorMap: {
          'Credit reporting': '#2cb34a',
          'Debt collection': '#addc91',
          'Credit card or prepaid card': '#257675',
          Mortgage: '#9ec4c3',
          'Checking or savings account': '#0072ce',
          Complaints: '#ADDC91',
          'All other products': '#a2a3a4',
        },
        dataRangeLine: {
          dataByTopic: [
            {
              topic: 'Credit reporting',
              topicName: 'Credit reporting',
              dashed: false,
              show: true,
              dates: [
                { date: '2020-03-01T00:00:00.000Z', value: 17231 },
                { date: '2020-04-01T00:00:00.000Z', value: 21179 },
                { date: '2020-05-01T00:00:00.000Z', value: 6868 },
                { date: '2020-06-01T00:00:00.000Z', value: 35112 },
                { date: '2020-07-01T00:00:00.000Z', value: 54345 },
              ],
            },
            {
              topic: 'Debt collection',
              topicName: 'Debt collection',
              dashed: false,
              show: true,
              dates: [
                { date: '2020-03-01T00:00:00.000Z', value: 4206 },
                { date: '2020-04-01T00:00:00.000Z', value: 4508 },
                { date: '2020-05-01T00:00:00.000Z', value: 1068 },
                { date: '2020-06-01T00:00:00.000Z', value: 35112 },
                { date: '2020-07-01T00:00:00.000Z', value: 54345 },
              ],
            },
            {
              topic: 'Credit card or prepaid card',
              topicName: 'Credit card or prepaid card',
              dashed: false,
              show: true,
              dates: [
                { date: '2020-03-01T00:00:00.000Z', value: 2435 },
                { date: '2020-04-01T00:00:00.000Z', value: 3137 },
                { date: '2020-05-01T00:00:00.000Z', value: 712 },
                { date: '2020-06-01T00:00:00.000Z', value: 35112 },
                { date: '2020-07-01T00:00:00.000Z', value: 54345 },
              ],
            },
            {
              topic: 'Mortgage',
              topicName: 'Mortgage',
              dashed: false,
              show: true,
              dates: [
                { date: '2020-03-01T00:00:00.000Z', value: 2132 },
                { date: '2020-04-01T00:00:00.000Z', value: 2179 },
                { date: '2020-05-01T00:00:00.000Z', value: 365 },
                { date: '2020-06-01T00:00:00.000Z', value: 35112 },
                { date: '2020-07-01T00:00:00.000Z', value: 54345 },
              ],
            },
            {
              topic: 'Checking or savings account',
              topicName: 'Checking or savings account',
              dashed: false,
              show: true,
              dates: [
                { date: '2020-03-01T00:00:00.000Z', value: 1688 },
                { date: '2020-04-01T00:00:00.000Z', value: 2030 },
                { date: '2020-05-01T00:00:00.000Z', value: 383 },
                { date: '2020-06-01T00:00:00.000Z', value: 35112 },
                { date: '2020-07-01T00:00:00.000Z', value: 54345 },
              ],
            },
          ],
        }
      }*/
      /*const component = renderComponent();
      expect(screen.getByText('Complaints')).toBeInTheDocument();
      expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
      //verify width, since its calculation is determined by lens type
      expect(
        component.container.querySelector('#line-chart').getBoundingClientRect()
          .width,
      ).toBe(750);*/
    });

    it('should render non-Overview chart in print mode, with equal last line date', () => {
      /*const component = renderComponent();
      expect(screen.getByText('Complaints')).toBeInTheDocument();
      expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
      //verify width, since its calculation is determined by lens type
      expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).toBe(500);
      expect(updateTrendsTooltipFn).not.toHaveBeenCalled();*/
    });

    it('should render non-Overview chart in print mode, without equal last line date', () => {
      /*const component = renderComponent();
      expect(screen.getByText('Complaints')).toBeInTheDocument();
      expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
      //verify width, since its calculation is determined by lens type
      expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).toBe(500);
      expect(updateTrendsTooltipFn).toHaveBeenCalledWith();*/
    });

    it('should render non-Overview chart not in print mode', () => {
      /**
       * const component = renderComponent();
      expect(screen.getByText('Complaints')).toBeInTheDocument();
      expect(screen.getByText('Date received by the CFPB')).toBeInTheDocument();
      //verify width, since its calculation is determined by lens type
      expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).not.toBe(500);
      expect(component.container.querySelector('#line-chart').getBoundingClientRect().width).not.toBe(750);
       */
    });

    it('should render with expected error message when no data is present', () => {
      const noTrends = {};
      renderComponent(noTrends);

      expect(
        screen.getByText(
          'Cannot display chart. Adjust your date range or date interval.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('tooltip actions', () => {
    it('should show tooltip for Overview charts', () => {
      //use test data for Overview chart test (with tooltip data) in initial states section
      //do mouseover to  show tooltip
      //verify that tooltip is shown
    });

    it('should update tooltip for Overview charts', () => {
      //use test data for Overview chart test (with tooltip data) in initial states section,  with tooltip initially shown
      //do mousemove to  update tooltip
      //verify that tooltip is shown with updated data
    });

    it('should hide tooltip for Overview charts', () => {
      //use test data for Overview chart test (with tooltip data) in initial states section,  with tooltip initially shown
      //do mouseout
      //verify that tooltip is hidden
    });

    it('should show tooltip for non-Overview charts, with equal dates', () => {
      //use test data for non-Overview chart with equal dates (with tooltip data) in initial state
      //do mousemove to trigger update
      //expect(updateTrendsTooltipFn).not.toHaveBeenCalled()
    });

    it('should show tooltip for non-Overview charts, with non-equal dates', () => {
      //use test data for non-Overview chart with non equal dates (with tooltip data) in initial state
      //do mousemove to trigger update
      //expect(updateTrendsTooltipFn).toHaveBeenCalledWith(TBD params)
    });
  });
});
