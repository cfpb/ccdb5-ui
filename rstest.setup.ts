import createFetchMock from 'rstest-fetch-mock';
import { setMaxDate } from './src/utils'

const fetchMocker = createFetchMock();
fetchMocker.enableMocks();

const d = new Date('2020-05-05T04:00:00.000Z')

setMaxDate(d)
rs.setSystemTime(d);

const mockClipboard = {
  writeText: rs.fn(() => Promise.resolve()),
  readText: rs.fn(() => Promise.resolve("mocked")),
};
