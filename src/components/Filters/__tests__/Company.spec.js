import { mapStateToProps } from '../Company';

describe('component::Company', () => {
  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        aggs: {
          company: [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
        },
        query: {
          company: [{ key: 'a' }],
          focus: '',
          lens: '',
          queryString: '?dsaf=fdas',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        options: [
          { disabled: false, key: 'a' },
          { disabled: false, key: 'b' },
          { disabled: false, key: 'c' },
        ],
        queryString: '?dsaf=fdas',
        selections: [{ key: 'a' }],
      });
    });

    it('disables some options on Focus page', () => {
      const state = {
        aggs: {
          company: [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
        },
        query: {
          company: [{ key: 'a' }],
          focus: 'a',
          lens: 'Company',
          queryString: '?dsaf=fdas',
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        options: [
          { disabled: false, key: 'a' },
          { disabled: true, key: 'b' },
          { disabled: true, key: 'c' },
        ],
        queryString: '?dsaf=fdas',
        selections: [{ key: 'a' }],
      });
    });
  });
});
