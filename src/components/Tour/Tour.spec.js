import { Tour } from './Tour';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultQuery } from '../../reducers/query/query';
import { defaultView } from '../../reducers/view/view';
import { merge } from '../../testUtils/functionHelpers';
import userEvent from '@testing-library/user-event';
import { MODE_LIST } from '../../constants';
import * as viewActions from '../../actions/view';

const renderComponent = (newAggsState, newQueryState, newViewModelState) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);
  merge(newViewModelState, defaultView);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
    view: newViewModelState,
  };
  return render(<Tour />, { preloadedState: data });
};

describe('Tour loading behavior', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const user = userEvent.setup({ delay: null });

  test("Tour doesn't load if page still loading", async () => {
    renderComponent({}, {}, { showTour: false });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test("Tour doesn't load unless tourShown state is true", async () => {
    renderComponent({ activeCall: '' }, {}, { showTour: false });
    expect(screen.queryByRole('dialog')).toBeNull();
    renderComponent({ activeCall: '' }, {}, { showTour: true });
    expect(await screen.findByRole('dialog')).toBeDefined();
  });

  test('Tour launches by clicking button', async () => {
    const tourShownSpy = jest
      .spyOn(viewActions, 'tourShown')
      .mockImplementation(() => jest.fn());

    renderComponent(
      { activeCall: '' },
      { tab: MODE_LIST },
      {
        showTour: false,
      },
    );

    expect(screen.getByRole('button', { name: /Take a tour/ })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Take a tour/ }));
    expect(tourShownSpy).toHaveBeenCalled();
  });
});
