// add custom jest matchers from jest-dom for testing library tests
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
jest.useFakeTimers().setSystemTime(new Date('2020-05-05T04:00:00.000Z'));
