import { Tour } from './tour';
import {
  screen,
  testRender as render,
  waitFor,
} from '../../test-utils/test-utils';
import * as viewActions from '../../reducers/view/view-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import userEvent from '@testing-library/user-event';
import { aggResponse } from '../list/list-panel/fixture';
import { queryState } from '../../reducers/query/query-slice';
import { BP_MED_MIN } from '../../constants/breakpoints';

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
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });
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

  test('reopens after the tour is closed', async () => {
    globalThis.confirm = rs.fn(() => true);
    mockFetchResponses();

    renderComponent({
      showTour: true,
      width: 1200,
    });
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    await user.click(document.querySelector('.introjs-skipbutton'));
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Take a tour/ }));
    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });
  });

  test('does not center the window on the welcome step', async () => {
    mockFetchResponses();
    const content = document.createElement('div');
    content.className = 'ccdb-content content';
    Object.defineProperty(content, 'clientHeight', { value: 4000 });
    content.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      bottom: 4000,
      right: 800,
      width: 800,
      height: 4000,
      toJSON() {
        return {};
      },
    });
    document.body.append(content);

    const scrollBy = rs
      .spyOn(globalThis, 'scrollBy')
      .mockImplementation(() => {});
    renderComponent({
      showTour: true,
      width: 1200,
    });

    await waitFor(() => {
      expect(document.querySelector('.introjs-tooltip.wide')).toBeTruthy();
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const offsets = scrollBy.mock.calls.map((call) =>
      typeof call[0] === 'number' ? call[1] : call[0]?.top,
    );
    expect(offsets.filter((offset) => Math.abs(offset) > 16)).toEqual([]);
  });

  test('builds mobile-specific steps on narrow viewports', async () => {
    mockFetchResponses();

    renderComponent({
      showTour: true,
      width: BP_MED_MIN - 1,
    });

    await waitFor(() => {
      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });
  });
});
