import target, {
  statesReceived,
  mapState,
  statesApiFailed,
  statesApiCalled,
  processStateAggregations,
} from './mapSlice';
import stateAggs from '../__fixtures__/stateAggs';
import { tabChanged } from '../view/viewSlice';

describe('reducer:map', () => {
  let action;

  describe('reducer', () => {
    it('has a default state', () => {
      expect(target(undefined, {})).toEqual({
        activeCall: '',
        error: false,
        results: {
          product: [],
          state: [],
        },
      });
    });
  });

  describe('handles STATES_API_CALLED actions', () => {
    action = {
      url: 'http://www.example.org',
    };
    expect(target(mapState, statesApiCalled(action))).toEqual({
      ...mapState,
      activeCall: 'http://www.example.org',
      error: false,
    });
  });

  describe('STATES_RECEIVED actions', () => {
    beforeEach(() => {
      action = {
        aggregations: stateAggs,
      };
    });

    it('maps data to object state', () => {
      const result = target(mapState, statesReceived(action));
      expect(result).toEqual({
        ...mapState,
        activeCall: '',
        error: false,
        results: {
          state: [
            { name: 'CA', value: 62519, issue: 'issue o', product: 'fo prod' },
            { name: 'FL', value: 47358, issue: 'issue o', product: 'fo' },
            { name: 'TX', value: 44469, issue: 'issue o', product: 'fo rod' },
            { name: 'GA', value: 28395, issue: 'issue o', product: 'fo prod' },
            { name: 'NY', value: 26846, issue: 'issue o', product: 'fo prod' },
            { name: 'IL', value: 18172, issue: 'issue o', product: 'fo prd' },
            { name: 'PA', value: 16054, issue: 'issue o', product: 'fo prod' },
            { name: 'NC', value: 15217, issue: 'issue o', product: 'fo prod' },
            { name: 'NJ', value: 15130, issue: 'issue o', product: 'fo prod' },
            { name: 'OH', value: 14365, issue: 'issue o', product: 'fo prod' },
            { name: 'VA', value: 12901, issue: 'issue o', product: 'fo prod' },
            { name: 'MD', value: 12231, issue: 'issue o', product: 'fo prod' },
            { name: 'MI', value: 10472, issue: 'issue o', product: 'fo prod' },
            { name: 'AZ', value: 10372, issue: 'issue o', product: 'fo prod' },
            { name: 'TN', value: 9011, issue: 'issue o', product: 'fo prod' },
            { name: 'WA', value: 8542, issue: 'issue o', product: 'fo prod' },
            { name: 'MA', value: 8254, issue: 'issue o', product: 'fo prod' },
            { name: 'MO', value: 7832, issue: 'issue o', product: 'fo prod' },
            { name: 'SC', value: 7496, issue: 'issue o', product: 'fo prod' },
            { name: 'CO', value: 7461, issue: 'issue o', product: 'fo prod' },
            { name: 'NV', value: 7095, issue: 'issue o', product: 'fo prod' },
            { name: 'LA', value: 6369, issue: 'issue o', product: 'fo prod' },
            { name: 'AL', value: 6178, issue: 'issue o', product: 'fo prod' },
            { name: 'IN', value: 5659, issue: 'issue o', product: 'fo prod' },
            { name: 'MN', value: 4957, issue: 'issue o', product: 'fo prod' },
            { name: 'CT', value: 4685, issue: 'issue o', product: 'fo prod' },
            { name: 'WI', value: 4443, issue: 'issue o', product: 'fo prod' },
            { name: 'OR', value: 4261, issue: 'issue o', product: 'fo prod' },
            { name: 'UT', value: 3693, issue: 'issue o', product: 'fo prod' },
            { name: 'KY', value: 3392, issue: 'issue o', product: 'fo prod' },
            { name: 'MS', value: 3237, issue: 'issue o', product: 'fo prod' },
            { name: 'OK', value: 2989, issue: 'issue o', product: 'fo prod' },
            { name: 'AR', value: 2691, issue: 'issue o', product: 'fo prod' },
            { name: 'DC', value: 2493, issue: 'issue o', product: 'fo prod' },
            { name: 'KS', value: 2307, issue: 'issue o', product: 'fo prod' },
            { name: 'NM', value: 2176, issue: 'issue o', product: 'fo prod' },
            { name: 'DE', value: 2160, issue: 'issue o', product: 'fo prod' },
            { name: 'IA', value: 1751, issue: 'issue o', product: 'fo prod' },
            { name: 'ID', value: 1436, issue: 'issue o', product: 'fo prod' },
            { name: 'NH', value: 1408, issue: 'issue o', product: 'fo prod' },
            { name: 'NE', value: 1343, issue: 'issue o', product: 'fo prod' },
            { name: 'RI', value: 1166, issue: 'issue o', product: 'fo prod' },
            { name: 'ME', value: 1155, issue: 'issue o', product: 'fo prod' },
            { name: 'WV', value: 1075, issue: 'issue o', product: 'fo prod' },
            { name: 'MT', value: 788, issue: 'issue o', product: 'fo prod' },
            { name: 'ND', value: 637, issue: 'issue o', product: 'fo prod' },
            { name: 'SD', value: 535, issue: 'issue o', product: 'fo prod' },
            { name: 'AK', value: 524, issue: 'issue o', product: 'fo prod' },
            { name: 'WY', value: 450, issue: 'issue o', product: 'fo prod' },
            { name: 'VT', value: 446, issue: 'issue o', product: 'fo prod' },
            { name: 'HI', value: 0, issue: '', product: '' },
          ],
          product: [
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: 'foo',
              parent: false,
              value: 600,
              width: 0.5,
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: 'goo',
              parent: false,
              value: 150,
              width: 0.5,
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: 'hi',
              parent: false,
              value: 125,
              width: 0.5,
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: 'indigo',
              parent: false,
              value: 75,
              width: 0.5,
            },
            {
              hasChildren: false,
              isNotFilter: false,
              isParent: true,
              name: 'joker',
              parent: false,
              value: 50,
              width: 0.5,
            },
          ],
        },
      });
    });
  });

  describe('STATES_FAILED actions', () => {
    it('handles failed error messages', () => {
      action = {
        message: 'foo bar',
        name: 'ErrorTypeName',
      };

      expect(
        target(
          {
            activeCall: 'someurl',
            results: {
              product: [1, 2, 3],
              state: [1, 2, 3],
            },
          },
          statesApiFailed(action),
        ),
      ).toEqual({
        ...mapState,
        activeCall: '',
        error: { message: 'foo bar', name: 'ErrorTypeName' },
        results: {
          product: [],
          state: [],
        },
      });
    });
  });

  describe('TAB_CHANGED action', () => {
    it('clears results and resets values', () => {
      expect(
        target(
          {
            ...mapState,
            results: [1, 2, 3],
          },
          tabChanged(),
        ),
      ).toEqual({
        ...mapState,
        error: false,
        results: {
          product: [],
          state: [],
        },
      });
    });
  });

  describe('helper functions', () => {
    describe('processStateAggregations', () => {
      it('handles empty buckets', () => {
        const stateData = {
          doc_count: 0,
          state: {
            buckets: [],
          },
        };
        const res = processStateAggregations(stateData);
        expect(res).toEqual([]);
      });
      it('calculates the data correctly', () => {
        const res = processStateAggregations(stateAggs.state);
        expect(res).toEqual([
          { name: 'CA', value: 62519, issue: 'issue o', product: 'fo prod' },
          { name: 'FL', value: 47358, issue: 'issue o', product: 'fo' },
          { name: 'TX', value: 44469, issue: 'issue o', product: 'fo rod' },
          { name: 'GA', value: 28395, issue: 'issue o', product: 'fo prod' },
          { name: 'NY', value: 26846, issue: 'issue o', product: 'fo prod' },
          { name: 'IL', value: 18172, issue: 'issue o', product: 'fo prd' },
          { name: 'PA', value: 16054, issue: 'issue o', product: 'fo prod' },
          { name: 'NC', value: 15217, issue: 'issue o', product: 'fo prod' },
          { name: 'NJ', value: 15130, issue: 'issue o', product: 'fo prod' },
          { name: 'OH', value: 14365, issue: 'issue o', product: 'fo prod' },
          { name: 'VA', value: 12901, issue: 'issue o', product: 'fo prod' },
          { name: 'MD', value: 12231, issue: 'issue o', product: 'fo prod' },
          { name: 'MI', value: 10472, issue: 'issue o', product: 'fo prod' },
          { name: 'AZ', value: 10372, issue: 'issue o', product: 'fo prod' },
          { name: 'TN', value: 9011, issue: 'issue o', product: 'fo prod' },
          { name: 'WA', value: 8542, issue: 'issue o', product: 'fo prod' },
          { name: 'MA', value: 8254, issue: 'issue o', product: 'fo prod' },
          { name: 'MO', value: 7832, issue: 'issue o', product: 'fo prod' },
          { name: 'SC', value: 7496, issue: 'issue o', product: 'fo prod' },
          { name: 'CO', value: 7461, issue: 'issue o', product: 'fo prod' },
          { name: 'NV', value: 7095, issue: 'issue o', product: 'fo prod' },
          { name: 'LA', value: 6369, issue: 'issue o', product: 'fo prod' },
          { name: 'AL', value: 6178, issue: 'issue o', product: 'fo prod' },
          { name: 'IN', value: 5659, issue: 'issue o', product: 'fo prod' },
          { name: 'MN', value: 4957, issue: 'issue o', product: 'fo prod' },
          { name: 'CT', value: 4685, issue: 'issue o', product: 'fo prod' },
          { name: 'WI', value: 4443, issue: 'issue o', product: 'fo prod' },
          { name: 'OR', value: 4261, issue: 'issue o', product: 'fo prod' },
          { name: 'UT', value: 3693, issue: 'issue o', product: 'fo prod' },
          { name: 'KY', value: 3392, issue: 'issue o', product: 'fo prod' },
          { name: 'MS', value: 3237, issue: 'issue o', product: 'fo prod' },
          { name: 'OK', value: 2989, issue: 'issue o', product: 'fo prod' },
          { name: 'AR', value: 2691, issue: 'issue o', product: 'fo prod' },
          { name: 'DC', value: 2493, issue: 'issue o', product: 'fo prod' },
          { name: 'KS', value: 2307, issue: 'issue o', product: 'fo prod' },
          { name: 'NM', value: 2176, issue: 'issue o', product: 'fo prod' },
          { name: 'DE', value: 2160, issue: 'issue o', product: 'fo prod' },
          { name: 'IA', value: 1751, issue: 'issue o', product: 'fo prod' },
          { name: 'ID', value: 1436, issue: 'issue o', product: 'fo prod' },
          { name: 'NH', value: 1408, issue: 'issue o', product: 'fo prod' },
          { name: 'NE', value: 1343, issue: 'issue o', product: 'fo prod' },
          { name: 'RI', value: 1166, issue: 'issue o', product: 'fo prod' },
          { name: 'ME', value: 1155, issue: 'issue o', product: 'fo prod' },
          { name: 'WV', value: 1075, issue: 'issue o', product: 'fo prod' },
          { name: 'MT', value: 788, issue: 'issue o', product: 'fo prod' },
          { name: 'ND', value: 637, issue: 'issue o', product: 'fo prod' },
          { name: 'SD', value: 535, issue: 'issue o', product: 'fo prod' },
          { name: 'AK', value: 524, issue: 'issue o', product: 'fo prod' },
          { name: 'WY', value: 450, issue: 'issue o', product: 'fo prod' },
          { name: 'VT', value: 446, issue: 'issue o', product: 'fo prod' },
          { name: 'HI', value: 0, issue: '', product: '' },
        ]);
      });
    });
  });
});
