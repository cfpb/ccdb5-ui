import { waitFor } from '../../testUtils/test-utils';
import fetchMock from 'jest-fetch-mock';
import { handleFetchSearch } from './utils';

fetchMock.enableMocks();

describe('Typeahead utils', () => {
  const url = 'http://example.com/';
  const setOptionsMock = jest.fn();

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify(['eagle', 'earth', 'east']));
  });

  test('handleFetchSearch when value is provided', async () => {
    handleFetchSearch('ea', setOptionsMock, url);
    await waitFor(() =>
      expect(setOptionsMock).toBeCalledWith([
        { key: 'eagle', label: 'eagle', position: 0, value: 'ea' },
        { key: 'earth', label: 'earth', position: 0, value: 'ea' },
        { key: 'east', label: 'east', position: 0, value: 'ea' },
      ]),
    );
  });

  test('handleFetchSearch when value is empty', async () => {
    handleFetchSearch('', setOptionsMock, url);
    await waitFor(() => expect(setOptionsMock).toBeCalledWith([]));
  });
});
