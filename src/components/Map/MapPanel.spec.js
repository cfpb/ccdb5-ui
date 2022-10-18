import configureMockStore from 'redux-mock-store';
import { MapPanel } from './MapPanel';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import { MODE_MAP } from '../../constants';

describe('component:MapPanel', () => {
  let target, tree;
  const renderComponent = ({ enablePer1000, isPrintMode }) => {
    const items = [
      { key: 'CA', doc_count: 62519 },
      { key: 'FL', doc_count: 47358 },
    ];

    const store = mockStore({
      aggs: {
        doc_count: 100,
        total: items.length,
      },
      map: {
        error: false,
        results: {
          issue: [],
          product: [],
          state: [],
        },
      },
      query: {
        date_received_min: new Date('7/10/2017'),
        date_received_max: new Date('7/10/2020'),
        enablePer1000,
        mapWarningEnabled: true,
        issue: [],
        product: [],
        tab: MODE_MAP,
      },
      view: {
        isPrintMode,
        width: 1000,
      },
    });
  };

  it('renders without crashing', () => {
    // target = setupSnapshot({ enablePer1000: true, isPrintMode: false });
    // tree = target.toJSON();
    // expect(tree).toMatchSnapshot();
  });

  // it('renders Print without crashing', () => {
  //   target = setupSnapshot({ enablePer1000: true, isPrintMode: true });
  //   tree = target.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
  //
  // it('renders warning without crashing', () => {
  //   target = setupSnapshot({ enablePer1000: false });
  //   tree = target.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  // describe('mapDispatchToProps', () => {
  //   it('hooks into dismissWarning', () => {
  //     const dispatch = jest.fn();
  //     mapDispatchToProps(dispatch).onDismissWarning();
  //     expect(dispatch.mock.calls.length).toEqual(1);
  //   });
  // });
});
