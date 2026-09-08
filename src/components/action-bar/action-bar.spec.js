import { ActionBar } from './action-bar';
import * as viewActions from '../../reducers/view/view-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../test-utils/test-utils';
import * as utils from '../../utils';
import { aggResponse } from '../list/list-panel/fixture';

describe('ActionBar', () => {
  const renderComponent = (newViewState) => {
    merge(newViewState, viewState);

    const data = {
      query: { dateLastIndexed: '2020-05-05' },
      routes: { queryString: '?sdafds' },
      view: newViewState,
    };

    render(<ActionBar />, {
      preloadedState: data,
    });
  };

  let gaSpy;
  beforeEach(() => {
    gaSpy = rs.spyOn(utils, 'sendAnalyticsEvent');
    fetchMock.resetMocks();
  });

  test('rendering', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));

    const view = {};

    const printModeOnSpy = rs
      .spyOn(viewActions, 'updatePrintModeOn')
      .mockImplementation(() => rs.fn());

    const dataExportSpy = rs
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => rs.fn());
    renderComponent(view);

    await screen.findByText(
      'Showing 4,303,365 matches out of 6,638,372 total complaints',
    );
    expect(
      screen.getByText(
        'Showing 4,303,365 matches out of 6,638,372 total complaints',
      ),
    ).toBeInTheDocument();
    const buttonExport = screen.getByRole('button', { name: /Export data/ });
    expect(buttonExport).toBeInTheDocument();
    fireEvent.click(buttonExport);
    expect(dataExportSpy).toHaveBeenCalledTimes(1);

    const buttonPrint = screen.getByRole('button', { name: /Print/ });
    expect(buttonPrint).toBeInTheDocument();
    fireEvent.click(buttonPrint);
    expect(gaSpy).toHaveBeenCalledWith('Print', 'Print');
    expect(printModeOnSpy).toHaveBeenCalledTimes(1);
  });
});
