// add custom jest matchers from jest-dom for testing library tests
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
jest.useFakeTimers().setSystemTime(new Date('2020-05-05T04:00:00.000Z'));

// TODO: remove this if this issue is resolved in jest
// https://github.com/jsdom/jsdom/issues/3363
global.structuredClone = (val) => {
  return typeof val !== 'undefined' ? JSON.parse(JSON.stringify(val)) : val;
};
