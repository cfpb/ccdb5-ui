import target from './results';
import * as sut from '../../actions/complaints';

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
      const action = {
        type: sut.COMPLAINTS_API_CALLED,
        url: 'http://www.example.org',
      };
      expect(target({}, action)).toEqual({
        activeCall: 'http://www.example.org',
      });
    });

    describe('handles COMPLAINTS_RECEIVED actions', () => {
      let action;

      beforeEach(() => {
        action = {
          type: sut.COMPLAINTS_RECEIVED,
          data: {
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
          },
        };
      });

      it('extracts the important data from inside the returned data', () => {
        expect(target({ error: 'foo' }, action)).toEqual({
          activeCall: '',
          error: '',
          items: [{ val: '123' }, { val: '456' }],
        });
      });

      it('replaces text with highlighted text if it exists', () => {
        action.data.hits.hits[0].highlight = { val: ['<em>123</em>'] };

        expect(target({ error: 'foo' }, action)).toEqual({
          activeCall: '',
          error: '',
          items: [{ val: '<em>123</em>' }, { val: '456' }],
        });
      });
    });

    it('handles COMPLAINTS_FAILED actions', () => {
      const action = {
        type: sut.COMPLAINTS_FAILED,
        error: 'foo bar',
      };
      expect(
        target(
          {
            items: [1, 2, 3],
          },
          action,
        ),
      ).toEqual({
        activeCall: '',
        error: 'foo bar',
        items: [],
      });
    });
  });
});
