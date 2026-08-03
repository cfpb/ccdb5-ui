// ----------------------------------------------------------------------------
// Exports
import dayjs from 'dayjs';
import dayjsUtc from 'dayjs/plugin/utc';

dayjs.extend(dayjsUtc);

type DateInput = string | Date | null | undefined;

export const formatDate = (uglyDate: DateInput): DateInput => {
  if (!uglyDate || (typeof uglyDate === 'string' && uglyDate.length === 10)) {
    return uglyDate;
  }
  return dayjs(new Date(uglyDate)).format('YYYY-MM-DD');
};

export const formatDisplayDate = (dateString: DateInput): string => {
  return dayjs(new Date(dateString as string | Date)).utc().format('M/D/YYYY');
};

export const formatNaturalDate = (dateString: DateInput): string => {
  return dayjs(new Date(dateString as string | Date))
    .utc()
    .format('MMMM D, YYYY');
};

export const adjustDate = (dateIn: DateInput): string =>
  dayjs(new Date(dateIn as string | Date))
    .utc()
    .add(5.5, 'hours')
    .format();

export const formatDateModel = (dateIn: DateInput): string =>
  dayjs(new Date(dateIn as string | Date))
    .utc()
    .add(5.5, 'hours')
    .format('YYYY-MM-DD');

export const isDateEqual = (date1: DateInput, date2: DateInput): boolean =>
  dayjs(new Date(date1 as string | Date)).isSame(
    new Date(date2 as string | Date),
    'day',
  );
