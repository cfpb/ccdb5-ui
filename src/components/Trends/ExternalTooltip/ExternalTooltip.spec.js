// import * as trendsUtils from '../../../utils/trends';
import { ExternalTooltip } from './ExternalTooltip';
import React from 'react';
import { merge } from '../../../testUtils/functionHelpers';
import { queryState } from '../../../reducers/query/query';
import { trendsState } from '../../../reducers/trends/trends';
import { testRender as render, screen } from '../../../testUtils/test-utils';

const renderComponent = (newQueryState, newTrendsState) => {
  merge(newQueryState, queryState);
  merge(newTrendsState, trendsState);

  const data = {
    query: newQueryState,
    trends: newTrendsState,
  };

  render(<ExternalTooltip />, {
    preloadedState: data,
  });
};

describe('component: ExternalTooltip', () => {
  test('empty rendering', () => {
    renderComponent({}, {});
    expect(screen.queryByText('foobar')).toBeNull();
  });
  test('rendering', () => {
    const query = {
      focus: '',
      lens: '',
    };
    const trends = {
      tooltip: {
        title: 'Date Range: 1/1/1900 - 1/1/2000',
        total: 2900,
        values: [
          { colorIndex: 1, name: 'foo', value: 1000 },
          { colorIndex: 2, name: 'bar', value: 1000 },
          { colorIndex: 3, name: 'All other', value: 900 },
          { colorIndex: 4, name: "Eat at Joe's", value: 1000 },
        ],
      },
    };
    renderComponent(query, trends);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('Date Range:')).toBeInTheDocument();
    expect(screen.getByText('1/1/1900 - 1/1/2000')).toBeInTheDocument();
    expect(screen.getByText('900')).toBeInTheDocument();
  });

  test('rendering Company typeahead', () => {
    const query = {
      focus: '',
      lens: 'Company',
    };
    const trends = {
      tooltip: {
        title: 'Date Range: 1/1/1900 - 1/1/2000',
        total: 2900,
        values: [
          { colorIndex: 1, name: 'foo', value: 1000 },
          { colorIndex: 2, name: 'bar', value: 1000 },
          { colorIndex: 3, name: 'All other', value: 900 },
          { colorIndex: 4, name: "Eat at Joe's", value: 1000 },
        ],
      },
    };
    renderComponent(query, trends);
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter company name'),
    ).toBeInTheDocument();
  });
});

// xdescribe('initial state', () => {////
//   it('renders focus without crashing', () => {
//     query.focus = 'foobar';
//     const target = setupSnapshot(query, tooltip);
//     const tree = target.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });

// describe('buttons', () => {
//   let cb = null;
//   let cbFocus;
//   let target = null;
//
//   beforeEach(() => {
//     cb = jest.fn();
//     cbFocus = jest.fn();
//     target = shallow(
//       <ExternalTooltip
//         remove={cb}
//         lens="Foo"
//         add={cbFocus}
//         hasCompanyTypeahead={true}
//         tooltip={{
//           title: 'foo title',
//           total: 20,
//           values: [
//             {
//               colorIndex: 1,
//               value: 10,
//               name: 'foo',
//             },
//             {
//               colorIndex: 2,
//               value: 10,
//               name: 'bar',
//             },
//           ],
//         }}
//       />,
//     );
//   });
//
//   it('remove is called the button is clicked', () => {
//     const prev = target.find('.tooltip-ul .color__1 .close');
//     prev.simulate('click');
//     expect(cb).toHaveBeenCalledWith('foo');
//   });
// });

// TODO: write test verifying click remove works
// describe('mapDispatchToProps', () => {
//   it('provides a way to call remove', () => {
//     jest.spyOn(trendsUtils, 'scrollToFocus');
//     const dispatch = jest.fn();
//     mapDispatchToProps(dispatch).remove('Foo');
//     expect(dispatch.mock.calls).toEqual([
//       [
//         {
//           payload: {
//             filterName: 'company',
//             filterValue: 'Foo',
//           },
//           meta: {
//             requery: 'REQUERY_ALWAYS',
//           },
//           type: 'query/removeFilter',
//         },
//       ],
//     ]);
//     expect(trendsUtils.scrollToFocus).not.toHaveBeenCalled();
//   });
// });

// describe('mapStateToProps', () => {
//   let state;
//   beforeEach(() => {
//     state = {
//       query: {
//         focus: '',
//         lens: 'Overview',
//       },
//       trends: {
//         tooltip: {
//           title: 'Date: 1/1/2015',
//           total: 100,
//           values: [],
//         },
//       },
//     };
//   });
//   // it('maps state and props', () => {
//   //   const actual = mapStateToProps(state);
//   //   expect(actual).toEqual({
//   //     focus: '',
//   //     lens: 'Overview',
//   //     hasCompanyTypeahead: false,
//   //     hasTotal: false,
//   //     tooltip: {
//   //       date: '1/1/2015',
//   //       heading: 'Date:',
//   //       title: 'Date: 1/1/2015',
//   //       total: 100,
//   //       values: [],
//   //     },
//   //   });
//   // });
//
//   // it('maps state and props - focus', () => {
//   //   state.query.focus = 'something else';
//   //   const actual = mapStateToProps(state);
//   //   expect(actual.focus).toEqual('focus');
//   // });
//
//   it('handles broken tooltip title', () => {
//     state.trends.tooltip.title = 'something else';
//     const actual = mapStateToProps(state);
//     expect(actual).toEqual({
//       focus: '',
//       lens: 'Overview',
//       hasCompanyTypeahead: false,
//       hasTotal: false,
//       tooltip: {
//         date: '',
//         heading: 'something else:',
//         title: 'something else',
//         total: 100,
//         values: [],
//       },
//     });
//   });
// });
