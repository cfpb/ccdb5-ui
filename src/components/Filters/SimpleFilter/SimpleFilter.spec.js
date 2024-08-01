import { extraData } from './SimpleFilter';

describe('component:SimpleFilter', () => {
  describe('extra data', () => {
    let props, aggs, query;

    beforeEach(() => {
      props = {
        fieldName: 'foo',
        desc: 'This is a description',
        title: 'Title',
      };

      aggs = {
        foo: [1, 2, 3, 4, 5, 6],
      };

      query = {
        foo: [1],
      };
    });

    test('shows if there are any active children', () => {
      expect(extraData(props.fieldName, aggs, query)).toEqual({
        options: [1, 2, 3, 4, 5, 6],
        hasChildren: true,
      });
    });

    test('hides if there are no active children', () => {
      query.foo = [];
      expect(extraData(props.fieldName, aggs, query)).toEqual({
        options: [1, 2, 3, 4, 5, 6],
        hasChildren: false,
      });
    });
  });
});
