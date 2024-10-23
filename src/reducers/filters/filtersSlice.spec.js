import target, {
  dataNormalizationUpdated,
  filterAdded,
  filterArrayAction,
  filterRemoved,
  filterToggled,
  filtersCleared,
  filtersReplaced,
  filtersState,
  mapWarningDismissed,
  multipleFiltersAdded,
  multipleFiltersRemoved,
  stateFilterAdded,
  stateFilterCleared,
  stateFilterRemoved,
  toggleFlagFilter,
} from './filtersSlice';
import * as types from '../../constants';
import { routeChanged } from '../routes/routesSlice';
import { focusChanged, focusRemoved } from '../trends/trendsSlice';

describe('Filters', () => {
  describe('FILTER_CHANGED actions updates query with filter state', () => {
    let key = '';
    let state = null;
    let filterName = '';
    let filterValue = null;

    beforeEach(() => {
      key = 'affirmative';
      filterName = 'issue';
      filterValue = { key };
      state = filtersState;
    });

    it('handles FILTER_CHANGED actions and returns correct object', () => {
      expect(target(state, filterToggled(filterName, filterValue))).toEqual({
        ...state,
        [filterName]: [key],
      });
    });

    it('creates a filter array if target is undefined', () => {
      const filterReturn = filterArrayAction(undefined, key);
      expect(filterReturn).toEqual([key]);
    });

    it('adds additional filters when passed', () => {
      const filterReturn = filterArrayAction([key], 'bye');
      expect(filterReturn).toEqual([key, 'bye']);
    });

    it('removes filters when already present', () => {
      const filterReturn = filterArrayAction([key, 'bye'], key);
      expect(filterReturn).toEqual(['bye']);
    });
  });

  describe('FILTER_ADDED actions', () => {
    let filterName, filterValue, state;
    beforeEach(() => {
      filterName = 'product';
      filterValue = 'baz';
    });

    it('adds a filter when one exists', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz', 'baz'],
      });
    });

    it('ignores a filter when it exists', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz', 'baz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz', 'baz'],
      });
    });

    it('handles a missing filter', () => {
      state = {
        ...filtersState,
        issue: ['bar', 'baz', 'qaz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['baz'],
        issue: ['bar', 'baz', 'qaz'],
      });
    });

    it('adds unknown filters', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterAdded('notafilter', filterValue))).toEqual({
        ...state,
        notafilter: ['baz'],
        product: ['bar', 'qaz'],
      });
    });

    it('handles a missing filter value', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterAdded(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz', 'baz'],
      });
    });

    describe('has_narrative', () => {
      it('handles when present', () => {
        filterName = 'has_narrative';
        state = {
          ...filtersState,
          has_narrative: true,
        };
        expect(target(state, filterAdded(filterName, filterValue))).toEqual({
          ...state,
          has_narrative: true,
        });
      });

      it('handles when absent', () => {
        filterName = 'has_narrative';
        expect(
          target(filtersState, filterAdded(filterName, filterValue)),
        ).toEqual({
          ...filtersState,
          has_narrative: true,
        });
      });
    });
  });

  describe('FILTER_REMOVED actions', () => {
    let filterName, filterValue, state;
    beforeEach(() => {
      filterName = 'product';
      filterValue = 'baz';
    });

    it('removes a filter when one exists', () => {
      state = {
        ...filtersState,
        product: ['bar', 'baz', 'qaz'],
      };
      expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz'],
      });
    });

    it('ignores a filter when non existent in state', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterRemoved('notafilter', filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz'],
      });
    });

    it('handles a missing filter', () => {
      state = {
        ...filtersState,
        issue: ['bar', 'baz', 'qaz'],
      };
      expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
        ...state,
        issue: ['bar', 'baz', 'qaz'],
      });
    });

    it('handles a missing filter value', () => {
      state = {
        ...filtersState,
        product: ['bar', 'qaz'],
      };
      expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
        ...state,
        product: ['bar', 'qaz'],
      });
    });

    describe('has_narrative', () => {
      it('handles when present', () => {
        filterName = 'has_narrative';
        state = {
          ...filtersState,
          has_narrative: true,
        };
        const newState = { ...state };
        delete newState.has_narrative;
        expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
          ...newState,
          enablePer1000: true,
        });
      });

      it('handles when present - Map', () => {
        filterName = 'has_narrative';
        state = {
          ...filtersState,
          dataNormalization: 'None',
          enablePer1000: true,
          has_narrative: true,
        };
        const newState = { ...state };
        delete newState.has_narrative;
        expect(target(state, filterRemoved(filterName, filterValue))).toEqual({
          ...newState,
        });
      });

      it('handles when absent', () => {
        filterName = 'has_narrative';
        expect(
          target(filtersState, filterRemoved(filterName, filterValue)),
        ).toEqual({
          ...filtersState,
          enablePer1000: true,
        });
      });
    });
  });

  describe('FILTER_ALL_REMOVED actions', () => {
    let state;
    beforeEach(() => {
      state = {
        ...filtersState,
        company: ['Acme'],
        has_narrative: true,
        timely: ['bar', 'baz', 'qaz'],
      };
    });

    it('clears all filters in Narratives Search mode', () => {
      const actual = target(
        state,
        filtersCleared(types.NARRATIVE_SEARCH_FIELD),
      );

      expect(actual).toMatchObject({
        ...filtersState,
        has_narrative: true,
      });
    });
  });

  describe('FILTER_MULTIPLE_ADDED actions', () => {
    let filterName, values, state;
    beforeEach(() => {
      filterName = 'issue';
      values = ['Mo Money', 'Mo Problems'];
    });

    it("adds all filters if they didn't exist", () => {
      expect(
        target(filtersState, multipleFiltersAdded(filterName, values)),
      ).toEqual({
        ...filtersState,
        issue: ['Mo Money', 'Mo Problems'],
      });
    });

    it('skips filters if they exist already', () => {
      state = {
        ...filtersState,
        issue: ['foo'],
      };
      values.push('foo');

      expect(target(state, multipleFiltersAdded(filterName, values))).toEqual({
        ...state,
        issue: ['foo', 'Mo Money', 'Mo Problems'],
      });
    });
  });

  describe('FILTER_MULTIPLE_REMOVED actions', () => {
    let filterName, values, state;
    beforeEach(() => {
      filterName = 'issue';
      values = ['Mo Money', 'Mo Problems', 'bar'];
    });

    it('removes filters if they exist', () => {
      state = {
        ...filtersState,
        issue: ['foo', 'Mo Money', 'Mo Problems'],
      };
      expect(target(state, multipleFiltersRemoved(filterName, values))).toEqual(
        {
          ...state,
          issue: ['foo'],
        },
      );
    });

    it('ignores action if they dont exist', () => {
      state = {
        ...filtersState,
        issue: ['foo'],
      };
      expect(
        target(state, multipleFiltersRemoved('notafilter', values)),
      ).toEqual({
        ...state,
        issue: ['foo'],
      });
    });

    it('ignores unknown filters', () => {
      expect(
        target(filtersState, multipleFiltersRemoved(filterName, values)),
      ).toEqual({
        ...filtersState,
        enablePer1000: true,
      });
    });
  });

  describe('FILTER_FLAG_CHANGED actions', () => {
    let filterName;
    beforeEach(() => {
      filterName = 'has_narrative';
    });

    it('adds narrative filter to empty state', () => {
      expect(target(filtersState, toggleFlagFilter(filterName))).toEqual({
        ...filtersState,
        has_narrative: true,
      });
    });

    it('toggles off narrative filter', () => {
      expect(
        target(
          { ...filtersState, has_narrative: true },
          toggleFlagFilter(filterName),
        ),
      ).toEqual({
        ...filtersState,
        enablePer1000: true,
      });
    });
  });

  describe('FILTER_REPLACED actions', () => {
    let state;
    it('replaces existing filter set', () => {
      const filterName = 'foobar';
      const values = [3, 4, 5];
      state = {
        ...filtersState,
        foobar: [1, 23, 2],
      };
      expect(target(state, filtersReplaced(filterName, values))).toEqual({
        ...state,
        foobar: [3, 4, 5],
        enablePer1000: true,
      });
    });
  });

  describe('FOCUS actions', () => {
    let result, state;
    it('handles focus changed', () => {
      state = {
        ...filtersState,
      };
      result = target(state, focusChanged('Foo', 'Product', ['bar', 'baz']));
      expect(result).toEqual({
        ...filtersState,
        product: ['bar', 'baz'],
      });
    });

    it('handles company changed', () => {
      state = {
        ...filtersState,
      };
      result = target(state, focusChanged('Foo', 'Company', ['bar', 'baz']));
      expect(result).toEqual({
        ...filtersState,
        company: ['Foo'],
        product: [],
      });
    });

    it('handles focus removed', () => {
      state = {
        ...filtersState,
        product: ['bar', 'baz', 'qaz'],
      };
      result = target(state, focusRemoved('Product'));
      expect(result).toEqual({
        ...filtersState,
      });
    });
  });
  describe('STATE_FILTERS', () => {
    let action, result;
    describe('STATE_FILTER_ADDED', () => {
      beforeEach(() => {
        action = { abbr: 'IL', name: 'Illinois' };
      });
      it('adds state filter', () => {
        result = target({ ...filtersState }, stateFilterAdded(action));
        expect(result).toEqual({
          ...filtersState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          state: ['IL'],
        });
      });
      it('does not add dupe state filter', () => {
        result = target(
          {
            ...filtersState,
            state: ['IL', 'TX'],
          },
          stateFilterAdded(action),
        );

        expect(result).toEqual({
          ...filtersState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          state: ['IL', 'TX'],
        });
      });
    });

    describe('STATE_FILTER_CLEARED', () => {
      it('removes state filters', () => {
        result = target(
          {
            ...filtersState,
            state: ['FO', 'BA'],
          },
          stateFilterCleared(),
        );

        expect(result).toEqual({
          ...filtersState,
          enablePer1000: true,
        });
      });
    });

    describe('STATE_FILTER_REMOVED', () => {
      beforeEach(() => {
        action = { abbr: 'IL', name: 'Illinois' };
      });
      it('removes a state filter', () => {
        result = target(
          {
            ...filtersState,
            state: ['CA', 'IL'],
          },
          stateFilterRemoved(action),
        );
        expect(result).toEqual({
          ...filtersState,
          enablePer1000: true,
          state: ['CA'],
        });
      });
      it('handles empty state', () => {
        result = target({ ...filtersState }, stateFilterRemoved(action));
        expect(result).toEqual({
          ...filtersState,
          enablePer1000: true,
        });
      });
    });
  });

  describe('Map', () => {
    let action, state;
    describe('Data normalization', () => {
      beforeEach(() => {
        action = 'FooBar';
        state = {
          ...filtersState,
        };
      });
      it('handles default value', () => {
        expect(target(state, dataNormalizationUpdated(action))).toEqual({
          ...state,
          dataNormalization: 'None',
        });
      });

      it('handles per 1000 value', () => {
        action = types.GEO_NORM_PER1000;
        expect(target(state, dataNormalizationUpdated(action))).toEqual({
          ...state,
          dataNormalization: 'Per 1000 pop.',
        });
      });
    });

    describe('Map Warning', () => {
      it('handles mapWarningDismissed action', () => {
        state = {
          ...filtersState,
          company: [1, 2, 3],
          product: 'bar',
          mapWarningEnabled: true,
        };
        expect(target(state, mapWarningDismissed())).toEqual({
          ...state,
          company: [1, 2, 3],
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          product: 'bar',
          mapWarningEnabled: false,
        });
      });
    });
  });
  describe('URL_CHANGED actions', () => {
    let actual, state;

    beforeEach(() => {
      state = { ...filtersState };
    });

    it('handles empty params', () => {
      expect(target(state, routeChanged('/', {}))).toEqual({
        ...state,
        enablePer1000: true,
      });
    });

    it('converts flag parameters to booleans', () => {
      const params = { has_narrative: 'true' };
      actual = target(state, routeChanged('/', params)).has_narrative;
      expect(actual).toEqual(true);
    });

    it('handles a single filter', () => {
      const params = { product: 'Debt Collection' };
      actual = target(state, routeChanged('/', params));
      expect(actual.product).toEqual(['Debt Collection']);
    });

    it('handles multiple filters', () => {
      const params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target(state, routeChanged('/', params));
      expect(actual.product).toEqual(['Debt Collection', 'Mortgage']);
    });
  });
});
