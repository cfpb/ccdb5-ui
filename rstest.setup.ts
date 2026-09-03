import createFetchMock from 'rstest-fetch-mock';
import { setMaxDate } from './src/utils';

process.env.NODE_ENV = 'test';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const fetchMocker = createFetchMock();
fetchMocker.enableMocks();

const d = new Date('2020-05-05T04:00:00.000Z');

setMaxDate(d);
rs.setSystemTime(d);
