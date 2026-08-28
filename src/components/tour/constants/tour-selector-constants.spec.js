import {
  TOUR_SCOPE,
  TOUR_SELECTORS,
  TOUR_STEP_TARGETS,
} from './tour-selector-constants';
import { LIST_COMPLAINTS_SELECTORS } from './tour-step-selectors';

describe('tour selector constants', () => {
  it('scopes shared selectors under the app root', () => {
    expect(TOUR_SCOPE).toBe('.ccdb-content');
    expect(TOUR_SELECTORS.FILTER_PANEL).toBe(
      '.ccdb-content aside.content__sidebar .filter-panel',
    );
    expect(TOUR_SELECTORS.DATE_FILTER).toBe(
      '.ccdb-content aside.content__sidebar .filter-panel .date-filter',
    );
    expect(TOUR_SELECTORS.EXPORT_BTN).toBe(
      '.ccdb-content [data-tour="download-complaint-data"]',
    );
  });

  it('uses complaint search filter and result targets', () => {
    expect(LIST_COMPLAINTS_SELECTORS.STEP_3).toBe(TOUR_STEP_TARGETS.FILTERS);
    expect(LIST_COMPLAINTS_SELECTORS.STEP_4).toBe(
      TOUR_STEP_TARGETS.DATE_RECEIVED,
    );
    expect(LIST_COMPLAINTS_SELECTORS.STEP_12).toBe(TOUR_STEP_TARGETS.RESULTS);
  });
});
