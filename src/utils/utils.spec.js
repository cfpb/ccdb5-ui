import {
  ariaReadoutNumbers,
  calculateDateRange,
  clamp,
  coalesce,
  debounce,
  formatPercentage,
  getFullUrl,
  enablePer1000,
  hashCode,
  processErrorMessage,
  sendAnalyticsEvent,
  shortIsoFormat,
  sortSelThenCount,
  startOfToday,
} from './index';
import Analytics from '../actions/analytics';
import MockDate from 'mockdate';
import { DATE_RANGE_MIN } from '../constants';
import dayjs from 'dayjs';
import dayjsCalendar from 'dayjs/plugin/calendar';
import dayjsUtc from 'dayjs/plugin/utc';

dayjs.extend(dayjsCalendar);
dayjs.extend(dayjsUtc);

describe('module::utils', () => {
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
    it('handles empty options array', () => {
      const actual = sortSelThenCount(null, [1, 2, 3]);
      expect(actual).toEqual([]);
    });
  });

  describe('startOfToday', () => {
    let origMaxDate;
    beforeAll(() => {
      origMaxDate = window.MAX_DATE;
    });

    beforeEach(() => {
      delete window.MAX_DATE;
      delete window.complaint_public_metadata;
    });

    afterAll(() => {
      window.MAX_DATE = origMaxDate;
    });

    it('sets MAX_DATE from the metadata', () => {
      window.complaint_public_metadata = {
        metadata_timestamp: '2020-05-09 02:39:23',
        qas_timestamp: '2020-05-08 23:48:52',
        total_count: 2611545,
      };

      const actual = startOfToday();
      expect(dayjs(actual).toISOString()).toBe('2020-05-09T00:00:00.000Z');
    });

    it('defaults MAX_DATE if the metadata is missing', () => {
      MockDate.set(dayjs('5/1/2020').utc());

      const actual = startOfToday();
      expect(dayjs(actual).toISOString()).toBe('2020-05-01T00:00:00.000Z');
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
