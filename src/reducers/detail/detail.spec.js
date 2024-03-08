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
    const payload = 'http://someurl.com';
    expect(detail(detailState, complaintDetailCalled(payload))).toEqual({
      ...detailState,
      activeCall: payload,
    });
  });

  it('handles complaintDetailReceived actions', () => {
    const payload = {
      data: {
        hits: {
          hits: [{ _source: '123' }],
          total: 1,
        },
      },
    };
    expect(detail(detailState, complaintDetailReceived(payload))).toEqual({
      activeCall: '',
      data: '123',
      error: '',
    });
  });

  it('handles complaintDetailFailed actions', () => {
    const payload = {
      error: 'foo bar',
    };
    expect(detail(detailState, complaintDetailFailed(payload))).toEqual({
      activeCall: '',
      data: {},
      error: 'foo bar',
    });
  });
});
