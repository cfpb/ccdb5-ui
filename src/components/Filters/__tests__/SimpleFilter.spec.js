import { mapStateToProps } from '../SimpleFilter';

describe('mapStateToProps', () => {
  let state, ownProps;
  beforeEach(() => {
    state = {
      aggs: {
        foo: [1, 2, 3, 4, 5, 6],
      },
      query: {
        foo: [1],
      },
    };
    ownProps = {
      fieldName: 'foo',
    };
  });

  it('shows if there are any active children', () => {
    const actual = mapStateToProps(state, ownProps);
    expect(actual).toEqual({
      options: [1, 2, 3, 4, 5, 6],
      hasChildren: true,
    });
  });

  it('hides if there are no active children', () => {
    state.query.foo = [];

    const actual = mapStateToProps(state, ownProps);
    expect(actual).toEqual({
      options: [1, 2, 3, 4, 5, 6],
      hasChildren: false,
    });
  });
});
