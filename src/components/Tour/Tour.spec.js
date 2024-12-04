import { Tour } from './Tour';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { viewState } from '../../reducers/view/viewSlice';
import { merge } from '../../testUtils/functionHelpers';
import userEvent from '@testing-library/user-event';
import { MODE_TRENDS } from '../../constants';
import * as viewActions from '../../reducers/view/viewSlice';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../Map/fixture';
import { trendsOverviewResponse } from '../Trends/TrendsPanel/fixture';

const renderComponent = (newViewModelState) => {
  merge(newViewModelState, viewState);

  const data = {
    routes: { queryString: '?sadfdsf=fdsds' },
    view: newViewModelState,
  };
  return render(<Tour />, { preloadedState: data });
};

describe('Tour loading behavior', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
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
    expect(await screen.findByRole('dialog')).toBeDefined();
  });

  test('Tour launches by clicking button', async () => {
    const tourShownSpy = jest
      .spyOn(viewActions, 'tourShown')
      .mockImplementation(() => jest.fn());

    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/trends?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(trendsOverviewResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });

    renderComponent({ tab: MODE_TRENDS, showTour: false });
    await screen.findByRole('button', { name: /Take a tour/ });
    expect(screen.getByRole('button', { name: /Take a tour/ })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Take a tour/ }));
    expect(tourShownSpy).toHaveBeenCalled();
  });
});
