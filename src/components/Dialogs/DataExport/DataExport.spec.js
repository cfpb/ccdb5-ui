import React from 'react';
import { DataExport } from './DataExport';
import * as utils from '../../../utils';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultAggs } from '../../../reducers/aggs/aggs';
import { defaultQuery } from '../../../reducers/query/query';
import * as viewActions from '../../../actions/view';
import { MODAL_TYPE_EXPORT_CONFIRMATION } from '../../../constants';
import { waitFor } from '@testing-library/react';

describe('DataExport', () => {
  const originalClipboard = { ...global.navigator.clipboard };

  const renderComponent = (newAggsState, newQueryState) => {
    const mockClipboard = {
      writeText: jest.fn(),
    };
    global.navigator.clipboard = mockClipboard;

    merge(newAggsState, defaultAggs);
    merge(newQueryState, defaultQuery);
    const data = {
      aggs: newAggsState,
      query: newQueryState,
    };
    render(<DataExport />, { preloadedState: data });
  };

  afterEach(() => {
    jest.resetAllMocks();
    global.navigator.clipboard = originalClipboard;
  });

  it('renders default state without crashing', async () => {
    const hideModalSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {});
    expect(screen.getByText('Export complaints')).toBeInTheDocument();

    // hide dataset buttons when no filters selected
    expect(
      screen.queryByText(/Select which complaints you'd like to export/),
    ).toBeNull();
    expect(
      screen.getByText(
        'Link to your complaint search results for future reference',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
    const buttonCopy = screen.getByRole('button', { name: /Copy/ });
    expect(buttonCopy).toBeInTheDocument();
    expect(buttonCopy).toHaveClass('a-btn__secondary');
    fireEvent.click(buttonCopy);
    await waitFor(() => {
      expect(buttonCopy).toHaveClass('export-url-copied');
    });

    expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    expect(hideModalSpy).toHaveBeenCalled();
  });

  it('closes the modal by clicking cancel', async () => {
    const hideModalSpy = jest
      .spyOn(viewActions, 'hideModal')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {});
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));
    expect(hideModalSpy).toHaveBeenCalled();
  });

  it('exports All complaints', async () => {
    const showModalSpy = jest
      .spyOn(viewActions, 'showModal')
      .mockImplementation(() => jest.fn());
    const sendAnalyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {});
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );
    fireEvent.click(screen.getByRole('button', { name: /Start export/ }));
    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export All Data',
      'Trends:csv',
    );
    expect(showModalSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('exports All complaints as json', async () => {
    const showModalSpy = jest
      .spyOn(viewActions, 'showModal')
      .mockImplementation(() => jest.fn());
    const sendAnalyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {});
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );

    const radioJson = screen.getByRole('radio', {
      name: /JSON/i,
    });
    expect(radioJson).not.toBeChecked();

    fireEvent.click(radioJson);

    await waitFor(() => {
      expect(radioJson).toBeChecked();
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(
        'https://files.consumerfinance.gov/ccdb/complaints.json.zip',
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /Start export/ }));
    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export All Data',
      'Trends:json',
    );
    expect(showModalSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('exports some complaints', async () => {
    const showModalSpy = jest
      .spyOn(viewActions, 'showModal')
      .mockImplementation(() => jest.fn());
    const sendAnalyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    renderComponent({ doc_count: 999, total: 10000 }, {});
    expect(
      screen.getByText(/Select which complaints you'd like to export/),
    ).toBeInTheDocument();
    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered dataset/i,
    });
    expect(radioFiltered).toBeInTheDocument();
    expect(radioFiltered).not.toBeChecked();

    const radioFull = screen.getByRole('radio', {
      name: /Full dataset/i,
    });
    expect(radioFull).toBeInTheDocument();
    expect(radioFull).toBeChecked();
    fireEvent.click(radioFiltered);
    await waitFor(() => {
      expect(radioFiltered).toBeChecked();
    });

    expect(screen.getByRole('textbox')).toHaveValue(
      'http://localhost/@@API?date_received_max=2020-05-05&' +
        'date_received_min=2017-05-05&field=all&format=csv&lens=product&' +
        'no_aggs=true&size=10000&sub_lens=sub_product&trend_depth=5&' +
        'trend_interval=month',
    );

    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start export/ }));

    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export Some Data',
      'Trends:csv',
    );
    expect(showModalSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('switches csv/json data formats', async () => {
    renderComponent({ doc_count: 999, total: 10000 }, {});
    expect(
      screen.getByText(/Select which complaints you'd like to export/),
    ).toBeInTheDocument();

    const radioJson = screen.getByRole('radio', {
      name: /JSON/i,
    });

    const radioCsv = screen.getByRole('radio', {
      name: /CSV/i,
    });
    expect(radioCsv).toBeChecked();
    expect(radioJson).not.toBeChecked();

    expect(screen.getByRole('textbox')).toHaveValue(
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );

    fireEvent.click(radioJson);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(
        'https://files.consumerfinance.gov/ccdb/complaints.json.zip',
      );
    });
    await waitFor(() => {
      expect(radioJson).toBeChecked();
    });

    await waitFor(() => {
      expect(radioCsv).not.toBeChecked();
    });

    fireEvent.click(radioCsv);

    await waitFor(() => {
      expect(radioCsv).toBeChecked();
    });
    await waitFor(() => {
      expect(radioJson).not.toBeChecked();
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(
        'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
      );
    });
  });

  it('switches dataset selections', async () => {
    renderComponent({ doc_count: 999, total: 10000 }, {});
    expect(
      screen.getByText(/Select which complaints you'd like to export/),
    ).toBeInTheDocument();

    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered dataset/i,
    });
    expect(radioFiltered).toBeInTheDocument();
    expect(radioFiltered).not.toBeChecked();

    const radioFull = screen.getByRole('radio', {
      name: /Full dataset/i,
    });
    expect(radioFull).toBeInTheDocument();
    expect(radioFull).toBeChecked();
    fireEvent.click(radioFiltered);
    await waitFor(() => {
      expect(radioFiltered).toBeChecked();
    });
    await waitFor(() => {
      expect(radioFull).not.toBeChecked();
    });
    fireEvent.click(radioFull);
    await waitFor(() => {
      expect(radioFiltered).not.toBeChecked();
    });
    await waitFor(() => {
      expect(radioFull).toBeChecked();
    });
  });
});
