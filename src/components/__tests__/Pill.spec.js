import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import * as filtersActions from '../../actions/filter';
import { merge } from '../../testUtils/functionHelpers';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultQuery } from '../../reducers/query/query';
import { Pill } from '../Search/Pill';

const renderComponent = (props, newAggsState = {}, newQueryState = {}) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
  };

  render(<Pill {...props} />, {
    preloadedState: data,
  });
};

describe('component::Pill', () => {
  const user = userEvent.setup({ delay: null });
  let dateRangeToggledFn;

  beforeEach(() => {
    dateRangeToggledFn = jest.spyOn(filtersActions, 'dateRangeToggled');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render in initial state', () => {
    const props = {
      fieldName: 'issue',
      value: 'abc',
    };
    renderComponent(props);
    expect(screen.getByText('abc')).toBeInTheDocument();
  });

  it('should remove date_received field as a filter', async () => {
    const props = {
      fieldName: 'date_received',
      value: 'abc',
    };

    renderComponent(props);

    expect(
      screen.getByRole('button', { name: /Remove abc as a filter/ }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: /Remove abc as a filter/ }),
    );
    expect(dateRangeToggledFn).toHaveBeenCalledWith('All');
  });

  it.skip('should remove other fields as a filter', async () => {
    const props = {
      fieldName: 'issue',
      value: 'abc',
    };
    renderComponent(props);

    await user.click(screen.getByRole('button'));
  });

  // TODO: rewrite these tests with testing library
  // it('allows the user to remove this filter', () => {
  //   const { target, props } = setupEnzyme()
  //   const button = target.find('button');
  //
  //   button.simulate('click');
  //   expect(props.remove).toHaveBeenCalled();
  // });

  // describe( 'mapDispatchToProps', () => {
  //   it( 'hooks into removeFilter', () => {
  //     const { props } = setupEnzyme()
  //     const dispatch = jest.fn()
  //     mapDispatchToProps( dispatch, props ).remove( { value: 'abc' } )
  //     expect( dispatch.mock.calls ).toEqual( [ [
  //       {
  //         filterName: 'foo',
  //         filterValue: 'abc',
  //         requery: 'REQUERY_ALWAYS',
  //         type: 'FILTER_REMOVED'
  //       }
  //     ] ] )
  //   } )
  //
  //   it( 'hooks into replaceFilters', () => {
  //     const { props } = setupEnzyme( { fieldName: 'issue', filters: [] } )
  //     const dispatch = jest.fn()
  //     mapDispatchToProps( dispatch, props ).remove( {
  //       aggs: [
  //         {
  //           key: 'abc',
  //           'sub_issue.raw': {
  //             buckets: [
  //               { key: 'def' },
  //               { key: 'def1' },
  //               { key: 'def2' } ]
  //           }
  //         }
  //       ],
  //       filters: [ 'abc123', slugify( 'abc', 'def' ), slugify( 'a', 'b' ) ],
  //       value: slugify( 'abc', 'def' )
  //     } )
  //     expect( dispatch.mock.calls ).toEqual( [ [
  //       {
  //         filterName: 'issue',
  //         requery: 'REQUERY_ALWAYS',
  //         type: 'FILTER_REPLACED',
  //         values: [
  //           'abc123',
  //           slugify( 'a', 'b' )
  //         ]
  //       }
  //     ] ] )
  //   } )
  // } )
});
