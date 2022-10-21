import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  testRender as render,
  screen,
  fireEvent,
  waitFor,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultAggs } from '../../../reducers/aggs/aggs';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultResults } from '../../../reducers/results/results';
import { defaultView } from '../../../reducers/view/view';
import { Input } from './Input';

describe('Input', () => {
  const handleEnterMock = jest.fn();
  const renderComponent = (handleChangeMock) =>
    // newAggsState,
    {
      // merge(newAggsState, defaultAggs);
      // const data = {
      //   aggs: newAggsState,
      // };

      render(
        <Input
          ariaLabel="Enter the term you want to search for"
          htmlId="searchText"
          handleChange={() => handleChangeMock()}
          placeholder="Enter your search term(s)"
          value={''}
          //   handleClear={onClearInput}
          handlePressEnter={handleEnterMock}
          isClearVisible={false}
        />
      );
    };

  test('Handle change is called', async () => {
    // jest.setTimeout(5000);
    const user = userEvent.setup();
    const handleChangeMock = jest.fn();

    renderComponent(handleChangeMock);
    const input = screen.getByRole('textbox');
    // screen.debug();
    await user.click(input);
    // await user.keyboard('value');

    // await user.type(
    //   screen.getByPlaceholderText('Enter your search term(s)'),
    //   'value'
    // );
    screen.debug();

    // await waitFor(() => {
    // expect(handleChangeMock).not.toBeCalled();
    // });
  });
});
