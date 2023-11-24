import target, {
  hitsCallInProcess,
  processHitsError,
  processHitsResults,
  resultsState,
} from './results';

describe('reducer:results', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
      activeCall: '',
      error: '',
      isLoading: false,
      items: [],
    });
  });

  describe('Complaints', () => {
    describe('handles COMPLAINTS_API_CALLED actions', () => {
      const action = {
        url: 'http://www.example.org',
      };
      expect(target(resultsState, hitsCallInProcess(action))).toEqual({
        ...resultsState,
        activeCall: 'http://www.example.org',
        isLoading: true,
      });
    });

    describe('handles COMPLAINTS_RECEIVED actions', () => {
      let action;

      beforeEach(() => {
        action = {
          data: {
            hits: {
              hits: [{ _source: { a: '123' } }, { _source: { a: '456' } }],
              total: 2,
            },
            _meta: {
              total_record_count: 162576,
              last_updated: '2017-07-10T00:00:00.000Z',
              last_indexed: '2017-07-11T00:00:00.000Z',
              license: 'CC0',
            },
          },
        };
      });

      it('extracts the important data from inside the returned data', () => {
        expect(
          target({ ...resultsState, error: 'foo' }, processHitsResults(action))
        ).toEqual({
          activeCall: '',
          error: '',
          isLoading: false,
          items: [{ a: '123' }, { a: '456' }],
        });
      });

      it('replaces text with highlighted text if it exists', () => {
        action.data.hits.hits[0].highlight = { a: ['<em>123</em>'] };

        expect(
          target({ ...resultsState, error: 'foo' }, processHitsResults(action))
        ).toEqual({
          activeCall: '',
          error: '',
          isLoading: false,
          items: [{ a: '<em>123</em>' }, { a: '456' }],
        });
      });
    });

    it('handles COMPLAINTS_FAILED actions', () => {
      const action = {
        error: 'foo bar',
      };
      expect(
        target({ ...resultsState, items: [1, 2, 3] }, processHitsError(action))
      ).toEqual({
        activeCall: '',
        error: 'foo bar',
        isLoading: false,
        items: [],
      });
    });
  });
});
