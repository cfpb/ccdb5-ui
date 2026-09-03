import { Tour } from './tour';
import { screen, testRender as render } from '../../test-utils/test-utils';
import * as viewActions from '../../reducers/view/view-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import userEvent from '@testing-library/user-event';
import { aggResponse } from '../list/list-panel/fixture';
import { queryState } from '../../reducers/query/query-slice';
import { BP_SM_SPLIT_WIDE_MIN } from '../../constants/breakpoints';

const mockFetchResponses = () => {
  fetchMock.mockResponse((req) => {
    if (req.url.includes('API?')) {
      return Promise.resolve({
        body: JSON.stringify(aggResponse),
      });
    }
    return Promise.resolve({ body: '{}' });
  });
};

const renderComponent = (newViewModelState) => {
  const newQueryState = { dateLastIndexed: '2021-01-01' };
  merge(newQueryState, queryState);
  merge(newViewModelState, viewState);

  const data = {
    query: newQueryState,
    routes: { queryString: '?sadfdsf=fdsds' },
    view: newViewModelState,
  };
  return render(<Tour />, { preloadedState: data });
};

describe('Tour loading behavior', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    globalThis.confirm = rs.fn(() => false);
  });
  afterEach(() => {
    rs.restoreAllMocks();
  });

  const user = userEvent.setup({ delay: null });

  test("Tour doesn't load if page still loading", async () => {
    renderComponent({ showTour: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test("Tour doesn't load unless tourShown state is true", async () => {
    renderComponent({ showTour: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    renderComponent({ showTour: true });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  test('Tour launches by clicking button', async () => {
    const tourShownSpy = rs
      .spyOn(viewActions, 'tourShown')
      .mockImplementation(() => rs.fn());

    mockFetchResponses();

    renderComponent({ showTour: false });
    await screen.findByRole('button', { name: /Take a tour/ });
    expect(screen.getByRole('button', { name: /Take a tour/ })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Take a tour/ }));
    expect(tourShownSpy).toHaveBeenCalled();
  });

  test('hides the tour when intro.js exits', async () => {
    globalThis.confirm = rs.fn(() => true);
    const tourHiddenSpy = rs
      .spyOn(viewActions, 'tourHidden')
      .mockImplementation(() => rs.fn());

    mockFetchResponses();

    renderComponent({
      showTour: true,
      width: 1200,
    });
    await screen.findByRole('dialog');

    const skipButton = document.querySelector('.introjs-skipbutton');
    expect(skipButton).not.toBeNull();
    await user.click(skipButton);

    expect(tourHiddenSpy).toHaveBeenCalled();
  });

  test('prompts before exiting an in-progress tour', async () => {
    mockFetchResponses();

    renderComponent({
      showTour: true,
      width: 1200,
    });
    await screen.findByRole('dialog');

    const skipButton = document.querySelector('.introjs-skipbutton');
    expect(skipButton).not.toBeNull();
    await user.click(skipButton);

    expect(confirm).toHaveBeenCalledWith(
      'Are you sure you want to exit the tour?',
    );
  });

  test('builds mobile-specific steps on narrow viewports', async () => {
    mockFetchResponses();

    renderComponent({
      showTour: true,
      width: BP_SM_SPLIT_WIDE_MIN - 1,
    });

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
