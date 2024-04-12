import { merge } from '../../testUtils/functionHelpers';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultQuery } from '../../reducers/query/query';
import { Company } from './Company';
import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';

const fixture = [
  { key: 'Monocle Popper Inc', doc_count: 9999 },
  { key: 'Safe-T Deposits LLC', doc_count: 999 },
  { key: 'Securitized Collateral Risk Obligations Credit Co', doc_count: 99 },
  { key: 'EZ Credit', doc_count: 9 },
];

const renderComponent = (newAggsState, newQueryState) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
  };

  render(<Company />, {
    preloadedState: data,
  });
};

fetchMock.enableMocks();

describe('component::Company', () => {
  const user = userEvent.setup({ delay: null });
  test('rendering', async () => {
    fetch.mockResponseOnce(['Safe-T Deposits LLC']);

    const aggs = {
      company: fixture,
    };

    const query = {
      company: ['Monocle Popper Inc'],
    };

    renderComponent(aggs, query);
    expect(
      screen.getByText('The complaint is about this company.'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter company name'),
    ).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Enter company name'), 'Safe');
    expect(screen.getByPlaceholderText('Enter company name')).toHaveValue(
      'Safe',
    );
    expect(
      screen.getByRole('checkbox', { name: 'Monocle Popper Inc' }),
    ).toBeInTheDocument();

    // test the selection of the typed items
    // expect(
    //   await screen.findByRole('option', { name: 'Safe-T Deposits LLC' }),
    // ).toBeInTheDocument();
    // TODO: continue tests once we upgrade this to use react-bootstrap-typeahead
  });
});
