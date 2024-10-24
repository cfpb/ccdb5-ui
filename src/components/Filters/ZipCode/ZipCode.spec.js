import {
  testRender as render,
  screen,
  waitFor,
} from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import * as filterActions from '../../../reducers/filters/filtersSlice';
import { ZipCode } from './ZipCode';

fetchMock.enableMocks();

describe('ZipCode', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const user = userEvent.setup({ delay: null });

  test('Options appear when user types and dispatches addMultipleFilters on selection', async () => {
    fetch.mockResponseOnce(
      JSON.stringify(['22191', '22202', '22031', '22203', '22204']),
    );
    const multipleFiltersAddedSpy = jest
      .spyOn(filterActions, 'multipleFiltersAdded')
      .mockImplementation(() => jest.fn());

    render(<ZipCode />);
    const input = screen.getByPlaceholderText(
      'Enter first three digits of ZIP code',
    );
    await user.type(input, '22');
    const option = await screen.findByRole('option', {
      name: /22191/,
    });
    await user.click(option);

    await waitFor(() =>
      expect(multipleFiltersAddedSpy).toBeCalledWith('zip_code', ['22191']),
    );
  });
});
