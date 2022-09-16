import * as sut from '../../actions/complaints';
import target from '../detail';

describe('reducer::detail', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
      data: {},
      error: '',
    });
  });

  it('handles COMPLAINT_DETAIL_RECEIVED actions', () => {
    const action = {
      type: sut.COMPLAINT_DETAIL_RECEIVED,
      data: {
        hits: {
          hits: [{ _source: '123' }],
          total: 1,
        },
      },
    };
    expect(target({}, action)).toEqual({
      data: '123',
      error: '',
    });
  });

  it('handles COMPLAINT_DETAIL_FAILED actions', () => {
    const action = {
      type: sut.COMPLAINT_DETAIL_FAILED,
      error: 'foo bar',
    };
    expect(target({}, action)).toEqual({
      data: {},
      error: 'foo bar',
    });
  });
});
