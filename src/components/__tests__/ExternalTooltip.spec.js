import * as trendsUtils from '../../utils/trends';
import ReduxExternalTooltip, {
  ExternalTooltip,
  mapDispatchToProps,
  mapStateToProps,
} from '../Trends/ExternalTooltip';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

function setupSnapshot(query, tooltip) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const store = mockStore({
    query,
    trends: {
      chartType: 'area',
      tooltip,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <ReduxExternalTooltip />
    </Provider>
  );
}

describe('initial state', () => {
  let query, tooltip;
  beforeEach(() => {
    query = {
      focus: '',
      lens: '',
    };
    tooltip = {
      title: 'Date Range: 1/1/1900 - 1/1/2000',
      total: 2900,
      values: [
        { colorIndex: 1, name: 'foo', value: 1000 },
        { colorIndex: 2, name: 'bar', value: 1000 },
        { colorIndex: 3, name: 'All other', value: 900 },
        { colorIndex: 4, name: "Eat at Joe's", value: 1000 },
      ],
    };
  });
  it('renders without crashing', () => {
    const target = setupSnapshot(query, tooltip);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders nothing without crashing', () => {
    const target = setupSnapshot(query, false);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders Company typehead without crashing', () => {
    query.lens = 'Company';
    const target = setupSnapshot(query, tooltip);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders "Other" without crashing', () => {
    tooltip.values.push({ colorIndex: 5, name: 'Other', value: 900 });
    const target = setupSnapshot(query, tooltip);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders focus without crashing', () => {
    query.focus = 'foobar';
    const target = setupSnapshot(query, tooltip);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('buttons', () => {
  let cb = null;
  let cbFocus;
  let target = null;

  beforeEach(() => {
    cb = jest.fn();
    cbFocus = jest.fn();
    target = shallow(
      <ExternalTooltip
        remove={cb}
        lens={'Foo'}
        add={cbFocus}
        showCompanyTypeahead={true}
        tooltip={{
          title: 'foo title',
          total: 20,
          values: [
            {
              colorIndex: 1,
              value: 10,
              name: 'foo',
            },
            {
              colorIndex: 2,
              value: 10,
              name: 'bar',
            },
          ],
        }}
      />
    );
  });

  it('remove is called the button is clicked', () => {
    const prev = target.find('.tooltip-ul .color__1 .close');
    prev.simulate('click');
    expect(cb).toHaveBeenCalledWith('foo');
  });
});

describe('mapDispatchToProps', () => {
  it('provides a way to call remove', () => {
    jest.spyOn(trendsUtils, 'scrollToFocus');
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).remove('Foo');
    expect(dispatch.mock.calls).toEqual([
      [
        {
          filterName: 'company',
          filterValue: 'Foo',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REMOVED',
        },
      ],
    ]);
    expect(trendsUtils.scrollToFocus).not.toHaveBeenCalled();
  });
});

describe('mapStateToProps', () => {
  let state;
  beforeEach(() => {
    state = {
      query: {
        focus: '',
        lens: 'Overview',
      },
      trends: {
        tooltip: {
          title: 'Date: 1/1/2015',
          total: 100,
          values: [],
        },
      },
    };
  });
  it('maps state and props', () => {
    let actual = mapStateToProps(state);
    expect(actual).toEqual({
      focus: '',
      lens: 'Overview',
      showCompanyTypeahead: false,
      showTotal: false,
      tooltip: {
        date: '1/1/2015',
        heading: 'Date:',
        title: 'Date: 1/1/2015',
        total: 100,
        values: [],
      },
    });
  });

  it('maps state and props - focus', () => {
    state.query.focus = 'something else';
    let actual = mapStateToProps(state);
    expect(actual.focus).toEqual('focus');
  });

  it('handles broken tooltip title', () => {
    state.trends.tooltip.title = 'something else';
    let actual = mapStateToProps(state);
    expect(actual).toEqual({
      focus: '',
      lens: 'Overview',
      showCompanyTypeahead: false,
      showTotal: false,
      tooltip: {
        date: '',
        heading: 'something else:',
        title: 'something else',
        total: 100,
        values: [],
      },
    });
  });
});
