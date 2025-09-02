import {
  ariaReadoutNumbers,
  calculateDateRange,
  clamp,
  coalesce,
  debounce,
  enablePer1000,
  formatPercentage,
  getFullUrl,
  hashCode,
  processErrorMessage,
  sendAnalyticsEvent,
  shortIsoFormat,
  sortSelThenCount,
  startOfToday,
} from './index';
import Analytics from '../actions/analytics';
import { DATE_RANGE_MIN, SLUG_SEPARATOR } from '../constants';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import dayjsUtc from 'dayjs/plugin/utc';

dayjs.extend(dayjsCalendar);
dayjs.extend(dayjsUtc);

describe('module::utils', () => {
  describe('startOfToday', () => {
    it('defaults MAX_DATE if the metadata is missing', () => {
      const actual = startOfToday();
      // this date is set in setupTests.js
      expect(dayjs(actual).toISOString()).toBe('2020-05-05T00:00:00.000Z');
    });
  });

  describe('ariaReadoutNumbers', () => {
    it('breaks a sequence of numbers into an expanded string', () => {
      const actual = ariaReadoutNumbers('123456');
      expect(actual).toBe('1 2 3 4 5 6');
    });

    it('handles empty strings', () => {
      const actual = ariaReadoutNumbers('');
      expect(actual).toBe('');
    });

    it('handles undefined', () => {
      const actual = ariaReadoutNumbers();
      expect(actual).toBe('');
    });
  });

  describe('shortIsoFormat', () => {
    it('handles nulls', () => {
      const actual = shortIsoFormat(null);
      expect(actual).toBe('');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('calls the passed in function after N milliseconds', () => {
      const spy = jest.fn();
      const target = debounce(spy, 200);
      target();
      expect(spy).not.toHaveBeenCalled();
      jest.advanceTimersByTime(200);
      expect(spy).toHaveBeenCalled();
    });

    it('only triggers one call while the timer is active', () => {
      const spy = jest.fn();
      const target = debounce(spy, 200);

      target();
      target();
      target();

      expect(spy).not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('passes arguments to the original function', () => {
      const spy = jest.fn();
      const target = debounce(spy, 200);

      target('foo', 'bar', 'baz', 'qaz');

      expect(spy).not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(spy).toHaveBeenCalledWith('foo', 'bar', 'baz', 'qaz');
    });
  });

  describe('coalesce edge cases', () => {
    it('handles non-objects', () => {
      const actual = coalesce(false, 'foo', 'bar');
      expect(actual).toBe('bar');
    });
  });

  describe('clamp', () => {
    it('limits values', () => {
      let actual = clamp(10, 1, 25);
      expect(actual).toEqual(10);

      actual = clamp(10, 1, 5);
      expect(actual).toEqual(5);

      actual = clamp(10, 15, 25);
      expect(actual).toEqual(15);
    });
  });

  describe('hashCode', () => {
    it('hashes strings', () => {
      let actual = hashCode('');
      expect(actual).toEqual(0);
      actual = hashCode('foobar');
      expect(actual).toEqual(-1268878963);
    });
  });

  describe('calculateDateInterval', () => {
    let start, end;
    beforeEach(() => {
      end = startOfToday();
    });

    it('returns empty when end date is not today', () => {
      start = new Date(2011, 1, 3);
      end = new Date(2013, 1, 3);
      const actual = calculateDateRange(start, end);
      expect(actual).toBe('');
    });

    it('returns empty when start date doesnt match anything', () => {
      start = new Date(1970, 1, 4);
      const actual = calculateDateRange(start, end);
      expect(actual).toBe('');
    });

    it('returns All when dates is full range', () => {
      start = DATE_RANGE_MIN;
      const actual = calculateDateRange(start, end);
      expect(actual).toBe('All');
    });

    it('returns 3y', () => {
      start = new Date(dayjs(end).subtract(3, 'years').calendar());
      const actual = calculateDateRange(start, end);
      expect(actual).toBe('3y');
    });

    it('returns 6m', () => {
      start = new Date(dayjs(end).subtract(6, 'months').calendar());
      const actual = calculateDateRange(start, end);
      expect(actual).toBe('6m');
    });
  });

  describe('formatPercentage', () => {
    it('handles regular values', () => {
      const actual = formatPercentage(0.5);
      expect(actual).toEqual(50.0);
    });
    it('handles NaN values', () => {
      const actual = formatPercentage(NaN);
      expect(actual).toEqual(0.0);
    });
  });

  describe('getFullUrl', () => {
    it('adds a host if needed', () => {
      const actual = getFullUrl('/foo/bar#baz?qaz=a&b=c');
      expect(actual).toBe('http://localhost/foo/bar#baz?qaz=a&b=c');
    });

    it('does not add a host if it is there', () => {
      const uri = 'https://www.example.org:8000/foo/bar#baz?qaz=a&b=c';
      const actual = getFullUrl(uri);
      expect(actual).toEqual(uri);
    });
  });

  describe('enablePer1000', () => {
    it('handles no filters', () => {
      const filters = {
        date: {},
        bogus: {},
        product: [],
      };

      expect(enablePer1000(filters)).toBeTruthy();
    });

    it('handles some filters', () => {
      const filters = {
        date: {},
        bogus: {},
        product: [{ name: 'foo', value: 123 }],
      };

      expect(enablePer1000(filters)).toBeFalsy();
    });

    it('handles flag filters', () => {
      const filters = {
        date: {},
        bogus: {},
        has_narrative: true,
      };

      expect(enablePer1000(filters)).toBeFalsy();
    });

    it('handles company_received filters', () => {
      const filters = {
        date: {},
        bogus: {},
        product: [],
        company_received_max: 'foo',
      };

      expect(enablePer1000(filters)).toBeFalsy();
    });

    it('allows state filter', () => {
      const filters = {
        date: {},
        bogus: {},
        product: [],
        state: ['FL', 'OR'],
      };

      expect(enablePer1000(filters)).toBeTruthy();
    });

    it('disallows state filter when others valid', () => {
      const filters = {
        date: {},
        bogus: {},
        product: ['BA'],
        state: ['FL', 'OR'],
      };

      expect(enablePer1000(filters)).toBeFalsy();
    });
  });

  describe('sortSelThenCount', () => {
    let options;
    beforeEach(() => {
      options = [
        {
          key: 'Credit reporting or other personal consumer reports',
          doc_count: 4782819,
          'sub_product.raw': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              { key: 'Credit reporting', doc_count: 4761272 },
              {
                key: 'Other personal consumer report',
                doc_count: 21547,
              },
            ],
          },
        },
        {
          key: 'Debt or credit management',
          doc_count: 5013,
          'sub_product.raw': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              { key: 'Debt settlement', doc_count: 2574 },
              {
                key: 'Credit repair services',
                doc_count: 2170,
              },
              {
                key: 'Mortgage modification or foreclosure avoidance',
                doc_count: 203,
              },
              { key: 'Student loan debt relief', doc_count: 66 },
            ],
          },
        },
        {
          key: 'Other financial service',
          doc_count: 1058,
          'sub_product.raw': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              { key: 'Debt settlement', doc_count: 333 },
              {
                key: 'Check cashing',
                doc_count: 266,
              },
              { key: 'Money order', doc_count: 143 },
              {
                key: 'Credit repair',
                doc_count: 102,
              },
              { key: 'Traveler’s/Cashier’s checks', doc_count: 88 },
              {
                key: 'Refund anticipation check',
                doc_count: 68,
              },
              { key: 'Foreign currency exchange', doc_count: 58 },
            ],
          },
        },
        {
          key: 'Virtual currency',
          doc_count: 18,
          'sub_product.raw': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
              {
                key: 'Domestic (US) money transfer',
                doc_count: 17,
              },
              { key: 'International money transfer', doc_count: 1 },
            ],
          },
        },
      ];
    });
    it('handles empty options array', () => {
      const actual = sortSelThenCount(null, ['foo', 'bar', 'zyz'], 'product');
      expect(actual).toEqual([
        {
          doc_count: 0,
          key: 'foo',
          'sub_product.raw': {
            buckets: [],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 0,
          key: 'bar',
          'sub_product.raw': {
            buckets: [],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
        {
          doc_count: 0,
          key: 'zyz',
          'sub_product.raw': {
            buckets: [],
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
          },
        },
      ]);
    });

    it('floats checked items to the top', () => {
      const filters = ['Virtual currency'];
      const actual = sortSelThenCount(options, filters, 'product');
      expect(actual[0].key).toEqual('Virtual currency');
    });

    it('floats child checked items to the top', () => {
      const filters = [
        'Virtual currency',
        `Debt or credit management${SLUG_SEPARATOR}Debt settlement`,
      ];
      const actual = sortSelThenCount(options, filters, 'product');
      expect(actual[0].key).toEqual('Virtual currency');
      expect(actual[1].key).toEqual('Debt or credit management');
    });
  });

  describe('processErrorMessage', () => {
    it('parses out an error', () => {
      const actual = processErrorMessage({
        name: 'foo',
        message: 'bar',
      });
      expect(actual).toEqual({
        name: 'foo',
        message: 'bar',
      });
    });
  });

  describe('sendAnalyticsEvent', () => {
    it('calls the analytics library', () => {
      Analytics.getDataLayerOptions = jest.fn();
      Analytics.sendEvent = jest.fn();
      sendAnalyticsEvent('myAction Name', 'some label');
      expect(Analytics.getDataLayerOptions).toHaveBeenCalledWith(
        'myAction Name',
        'some label',
      );
      expect(Analytics.sendEvent).toHaveBeenCalled();
    });
  });
});
