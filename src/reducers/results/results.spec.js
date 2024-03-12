import target, {
  complaintsApiCalled,
  complaintsApiFailed,
  complaintsReceived,
  resultsState,
} from './results';

describe('reducer:results', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
      activeCall: '',
      error: '',
      items: [],
    });
  });

  describe('Complaints', () => {
    describe('handles COMPLAINTS_API_CALLED actions', () => {
      const payload = 'http://www.example.org';
      expect(target(resultsState, complaintsApiCalled(payload))).toEqual({
        ...resultsState,
        activeCall: 'http://www.example.org',
      });
    });

    describe('handles COMPLAINTS_RECEIVED actions', () => {
      let payload;

      beforeEach(() => {
        payload = {
          hits: {
            hits: [{ _source: { val: '123' } }, { _source: { val: '456' } }],
            total: 2,
          },
          _meta: {
            total_record_count: 162576,
            last_updated: '2017-07-10T00:00:00.000Z',
            last_indexed: '2017-07-11T00:00:00.000Z',
            license: 'CC0',
          },
        };
      });

      it('extracts the important data from inside the returned data', () => {
        expect(
          target(
            { ...resultsState, error: 'foo' },
            complaintsReceived(payload),
          ),
        ).toEqual({
          activeCall: '',
          error: '',
          items: [{ val: '123' }, { val: '456' }],
        });
      });

      it('replaces text with highlighted text if it exists', () => {
        payload.hits.hits[0].highlight = { val: ['<em>123</em>'] };

        expect(
          target(
            { ...resultsState, error: 'foo' },
            complaintsReceived(payload),
          ),
        ).toEqual({
          activeCall: '',
          error: '',
          items: [{ val: '<em>123</em>' }, { val: '456' }],
        });
      });
    });

    it('handles COMPLAINTS_FAILED actions', () => {
      const action = {
        error: 'foo bar',
      };
      expect(
        target(
          { ...resultsState, items: [1, 2, 3] },
          complaintsApiFailed(action),
        ),
      ).toEqual({
        activeCall: '',
        error: 'foo bar',
        items: [],
      });
    });
  });
});
