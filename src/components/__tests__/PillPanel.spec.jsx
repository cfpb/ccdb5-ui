import React from 'react';
import { PillPanel } from '../Search/PillPanel';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
// import MockDate from "mockdate";
// import dayjs from "dayjs";

function setupSnapshot(initialQueryState = {}, initialAggState = {}) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    aggs: initialAggState,
    query: initialQueryState,
  });

  return renderer.create(
    <Provider store={store}>
      <PillPanel />
    </Provider>
  );
}

describe('component:PillPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot({
      date_received_max: '2019-12-01T12:00:00.000Z',
      date_received_min: '2011-12-01T12:00:00.000Z',
      company: ['Apples', 'Bananas are great'],
      timely: ['Yes'],
    });
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('does not renders patched filters', () => {
    const aggs = {
      issue: [
        {
          key: 'a',
          'sub_issue.raw': {
            buckets: [{ key: 'b' }, { key: 'c' }, { key: 'd' }],
          },
        },
      ],
    };
    const target = setupSnapshot(
      {
        date_received_max: '2020-05-05T12:00:00.000Z',
        date_received_min: '2011-12-01T12:00:00.000Z',
        issue: ['a', 'Bananas are great'],
      },
      aggs
    );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('does not render when there are no filters', () => {
    const target = setupSnapshot({
      date_received_max: '2020-05-05T12:00:00.000Z',
      date_received_min: '2011-12-01T12:00:00.000Z',
    });
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('adds a has narrative pill', () => {
    const target = setupSnapshot({
      date_received_max: '2020-05-05T12:00:00.000Z',
      date_received_min: '2011-12-01T12:00:00.000Z',
      has_narrative: true,
    });
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // TODO: rewrite tests for redux actions
});
