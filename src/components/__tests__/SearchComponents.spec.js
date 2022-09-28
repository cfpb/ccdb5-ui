import { mapStateToProps } from '../Search/SearchComponents';

describe('component: SearchComponents', () => {
  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        view: {
          isPrintMode: false,
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        printClass: '',
      });
    });

    it('maps state and props print', () => {
      const state = {
        view: {
          isPrintMode: true,
        },
      };
      const actual = mapStateToProps(state);
      expect(actual).toEqual({
        printClass: 'print',
      });
    });
  });
});
