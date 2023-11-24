import detail, {
  complaintDetailCalled,
  complaintDetailFailed,
  complaintDetailReceived,
  detailState,
} from '../../reducers/detail/detail';
describe('reducer::detail', () => {
  it('has a default state', () => {
    expect(detail(undefined, {})).toEqual({
      activeCall: '',
      data: {},
      error: '',
    });
  });

  it('handles complaintDetailCalled actions', () => {
    const action = {
      url: 'http://someurl.com',
    };
    expect(detail(detailState, complaintDetailCalled(action))).toEqual({
      ...detailState,
      activeCall: action.url,
    });
  });

  it('handles complaintDetailReceived actions', () => {
    const action = {
      data: {
        hits: {
          hits: [{ _source: '123' }],
          total: 1,
        },
      },
    };
    expect(detail(detailState, complaintDetailReceived(action))).toEqual({
      activeCall: '',
      data: '123',
      error: '',
    });
  });

  it('handles complaintDetailFailed actions', () => {
    const action = {
      error: 'foo bar',
    };
    expect(detail(detailState, complaintDetailFailed(action))).toEqual({
      activeCall: '',
      data: {},
      error: 'foo bar',
    });
  });
});
