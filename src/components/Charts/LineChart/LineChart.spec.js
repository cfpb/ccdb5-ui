import { testRender as render, screen } from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
//import userEvent from '@testing-library/user-event';
import { LineChart } from './LineChart';
import { defaultTrends } from '../../../reducers/trends/trends';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';

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
  describe('initial state', () => {
    it('should render Overview chart with data', () => {
      renderComponent();
      expect(screen.getByText('Complaints')).toBeInTheDocument();
    });

    it('should render non-Overview chart in print mode, with last line date', () => {});

    it('should render non-Overview chart in print mode, without last line date', () => {});

    it('should render non-Overview chart not in print mode', () => {});

    it('should render with expected error message when no data is present', () => {
      const trends = {};
      renderComponent(trends);

      expect(
        screen.getByText(
          'Cannot display chart. Adjust your date range or date interval.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('tooltip actions', () => {
    it('should show tooltip for Overview charts', () => {});

    it('should hide tooltip for Overview charts', () => {});

    it('should show tooltip for non-Overview charts, with equal dates', () => {});

    it('should show tooltip for non-Overview charts, with non-equal dates', () => {});
  });

  // TODO: rewrite these tests with testing library
  /*describe('componentDidUpdate', () => {
    let mapDiv;
    const lastDate = '2020-05-01T00:00:00.000Z';
    const colorMap = {
      'Credit reporting': '#2cb34a',
      'Debt collection': '#addc91',
      'Credit card or prepaid card': '#257675',
      Mortgage: '#9ec4c3',
      'Checking or savings account': '#0072ce',
      Complaints: '#ADDC91',
      'All other products': '#a2a3a4',
    };
    const data = {
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
          ],
        },
      ],
    };
    beforeEach(() => {
      mapDiv = document.createElement('div');
      mapDiv.setAttribute('id', 'line-chart-foo');
      window.domNode = mapDiv;
      document.body.appendChild(mapDiv);
    });

    afterEach(() => {
      const div = document.getElementById('line-chart-foo');
      if (div) {
        document.body.removeChild(div);
      }
      jest.clearAllMocks();
    });

    it('does nothing when no data', () => {
      const target = shallow(<LineChart data={[]} title="foo" />);
      target._redrawChart = jest.fn();
      target.setProps({ data: [] });
      expect(target._redrawChart).toHaveBeenCalledTimes(0);
    });

    xit('trigger a new update when data changes', () => {
      const target = shallow(
        <LineChart
          tooltipUpdated={jest.fn()}
          colorMap={colorMap}
          data={data}
          dateRange={{
            from: '1/1/2020',
            to: '5/30/2021',
          }}
          interval="Month"
          processData={data}
          title="foo"
          tooltip={{ date: '5/30/2021' }}
          lastDate={lastDate}
          hasChart={true}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      const newData = {
        dataByTopic: [
          {
            topic: 'Mortgage',
            topicName: 'Mortgage',
            dashed: false,
            show: true,
            dates: [
              { date: '2020-03-01T00:00:00.000Z', value: 2132 },
              { date: '2020-04-01T00:00:00.000Z', value: 2179 },
              { date: '2020-05-01T00:00:00.000Z', value: 365 },
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
            ],
          },
        ],
      };

      target.setProps({ data: newData });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    xit('trigger a new update when isPrintMode changes', () => {
      const target = shallow(
        <LineChart
          data={data}
          tooltipUpdated={jest.fn()}
          colorMap={colorMap}
          isPrintMode={false}
          dateRange={{
            from: '1/1/2020',
            to: '5/30/2021',
          }}
          interval="Month"
          processData={data}
          title="foo"
          tooltip={{ date: '5/30/2021' }}
          lastDate={lastDate}
          hasChart={true}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ isPrintMode: true });
      expect(sp).toHaveBeenCalledTimes(1);
    });

    xit('trigger a new update when width changes', () => {
      const target = shallow(
        <LineChart
          colorMap={colorMap}
          data={data}
          dateRange={{
            from: '1/1/2020',
            to: '1/1/2021',
          }}
          interval="Month"
          tooltipUpdated={jest.fn()}
          isPrintMode={false}
          processData={data}
          width={1000}
          title="foo"
          tooltip={{ date: '5/30/2021' }}
          lastDate={lastDate}
          hasChart={true}
        />,
      );
      target._redrawChart = jest.fn();
      const sp = jest.spyOn(target.instance(), '_redrawChart');
      target.setProps({ width: 600 });
      expect(sp).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapDispatchToProps', () => {
    it('provides a way to call updateTrendsTooltip', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).tooltipUpdated('foo');
      expect(dispatch.mock.calls).toEqual([
        [
          {
            requery: 'REQUERY_NEVER',
            type: 'TRENDS_TOOLTIP_CHANGED',
            value: 'foo',
          },
        ],
      ]);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          dateInterval: 'Month',
          date_received_min: '',
          date_received_max: '',
          lens: 'Overview',
        },
        trends: {
          colorMap: {},
          results: {
            dateRangeLine: [],
          },
          tooltip: false,
        },
        view: {
          isPrintMode: false,
          width: 1000,
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        colorMap: {},
        data: [],
        interval: 'Month',
        dateRange: {
          from: '',
          to: '',
        },
        lens: 'Overview',
        isPrintMode: false,
        processData: [],
        tooltip: false,
        hasChart: false,
        width: 1000,
      });
    });
  });

  describe('tooltip events', () => {
    let target, cb;

    beforeEach(() => {
      cb = jest.fn();
    });

    it('updates external tooltip with different data', () => {
      const data = {
        dataByTopic: [],
      };
      target = shallow(
        <LineChart
          data={data}
          interval="Month"
          dateRange={{ from: '2012', to: '2020' }}
          title="foo"
          tooltip={{ date: '2000' }}
          tooltipUpdated={cb}
        />,
      );
      const instance = target.instance();
      instance._updateTooltip({ date: '2012', value: 2000 });
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('does not external tooltip with same data', () => {
      const data = {
        dataByTopic: [],
      };
      target = shallow(
        <LineChart
          data={data}
          interval="Month"
          dateRange={{ from: '2012', to: '2020' }}
          title="foo"
          tooltip={{ date: '2000' }}
          tooltipUpdated={cb}
        />,
      );
      const instance = target.instance();
      instance._updateTooltip({ date: '2000', value: 100 });
      expect(cb).toHaveBeenCalledTimes(0);
    });

    it('internal tooltip', () => {
      const data = {
        dataByTopic: [],
      };
      target = shallow(
        <LineChart
          data={data}
          interval="Month"
          dateRange={{ from: '2012', to: '2020' }}
          title="foo"
        />,
      );
      const instance = target.instance();
      instance.tip = {
        title: jest.fn(),
        update: jest.fn(),
      };
      instance._updateInternalTooltip({ date: '2012', value: 200 }, {}, 0);
      expect(instance.tip.title).toHaveBeenCalledTimes(1);
    });
  });

  describe('helpers', () => {
    describe('_chartWidth', () => {
      it('gets print width - Overview', () => {
        const data = {
          dataByTopic: [],
        };
        const target = shallow(
          <LineChart
            isPrintMode={true}
            lens="Overview"
            data={data}
            interval="Month"
            dateRange={{
              from: '2012',
              to: '2020',
            }}
            title="foo"
          />,
        );
        expect(target.instance()._chartWidth('#foo')).toEqual(750);
      });
    });
  });*/
});
