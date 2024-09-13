import { PillPanel } from './PillPanel';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { defaultQuery } from '../../reducers/query/query';

// import MockDate from "mockdate";
// import dayjs from "dayjs";

const renderComponent = (newQueryState) => {
  merge(newQueryState, defaultQuery);

  const data = {
    query: newQueryState,
  };
  render(<PillPanel />, {
    preloadedState: data,
  });
};
describe('component: PillPanel', () => {
  it('renders without crashing', () => {
    renderComponent({});
    expect(screen.getByText('Filters applied:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Date Received: 5\/5\/2017 - 5\/5\/2020/,
      }),
    ).toBeInTheDocument();
  });
  // it('renders without crashing', () => {
  //   const target = setupSnapshot({
  //     date_received_max: '2019-12-01T12:00:00.000Z',
  //     date_received_min: '2011-12-01T12:00:00.000Z',
  //     company: ['Apples', 'Bananas are great'],
  //     timely: ['Yes'],
  //   });
  //   const tree = target.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
  //
  // it('does not renders patched filters', () => {
  //   const aggs = {
  //     issue: [
  //       {
  //         key: 'a',
  //         'sub_issue.raw': {
  //           buckets: [{ key: 'b' }, { key: 'c' }, { key: 'd' }],
  //         },
  //       },
  //     ],
  //   };
  //   const target = setupSnapshot(
  //     {
  //       date_received_max: '2020-05-05T12:00:00.000Z',
  //       date_received_min: '2011-12-01T12:00:00.000Z',
  //       issue: ['a', 'Bananas are great'],
  //     },
  //     aggs,
  //   );
  //   const tree = target.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
  //
  // it('does not render when there are no filters', () => {
  //   const target = setupSnapshot({
  //     date_received_max: '2020-05-05T12:00:00.000Z',
  //     date_received_min: '2011-12-01T12:00:00.000Z',
  //   });
  //   const tree = target.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
  //
  // it('adds a has narrative pill', () => {
  //   const target = setupSnapshot({
  //     date_received_max: '2020-05-05T12:00:00.000Z',
  //     date_received_min: '2011-12-01T12:00:00.000Z',
  //     has_narrative: true,
  //   });
  //   const tree = target.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
  //
  // // TODO: rewrite tests for redux actions
});
