// jest.setup.js
process.env.NODE_ENV = 'test';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
if (typeof window !== 'undefined') {
  window.IS_REACT_ACT_ENVIRONMENT = true;
}

import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { TextDecoder, TextEncoder } from 'node:util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (!global.CSS) {
  global.CSS = {
    supports: () => false,
  };
} else if (typeof global.CSS.supports !== 'function') {
  global.CSS.supports = () => false;
}

fetchMock.enableMocks();

jest.useFakeTimers('modern');
jest.setSystemTime(new Date('2020-05-05T04:00:00.000Z'));

// TODO: remove this if this issue is resolved in jest
// https://github.com/jsdom/jsdom/issues/3363
global.structuredClone = (val) => {
  return typeof val !== 'undefined' ? JSON.parse(JSON.stringify(val)) : val;
};
