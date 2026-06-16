import {
  TOUR_SCOPE,
  TOUR_SELECTORS,
  TOUR_STEP_TARGETS,
} from './tourSelectorConstants';
import {
  GEO_STEP_SELECTORS,
  LIST_COMPLAINTS_SELECTORS,
  TRENDS_SELECTORS,
} from './tourStepSelectors';

describe('tour selector constants', () => {
  it('scopes shared selectors under the app root', () => {
    expect(TOUR_SCOPE).toBe('.ccdb-content');
    expect(TOUR_SELECTORS.FILTER_PANEL).toBe(
      '.ccdb-content aside.content__sidebar .filter-panel',
    );
    expect(TOUR_SELECTORS.DATE_FILTER).toBe(
      '.ccdb-content aside.content__sidebar .filter-panel .date-filter',
    );
    expect(TOUR_SELECTORS.TABBED_NAVIGATION).toBe(
      '.ccdb-content [data-tour="tabbed-navigation"] section',
    );
    expect(TOUR_SELECTORS.ROW_CHART_SECTION).toBe(
      '.ccdb-content [data-tour="row-chart-section"]',
    );
    expect(TOUR_SELECTORS.MAP_ROW_CHART_SECTION).toBe(
      '.ccdb-content .map-panel [data-tour="row-chart-section"]',
    );
    expect(TOUR_SELECTORS.EXPORT_BTN).toBe(
      '.ccdb-content .export-results .export-btn',
    );
  });

  it('uses a map-specific row chart target in the geo tour', () => {
    expect(GEO_STEP_SELECTORS.STEP_14).toBe(TOUR_STEP_TARGETS.MAP_ROW_CHARTS);
    expect(TRENDS_SELECTORS.STEP_14).toBe(TOUR_STEP_TARGETS.ROW_CHARTS);
  });

  it('uses the same filter targets across map, list, and trends tours', () => {
    expect(GEO_STEP_SELECTORS.STEP_4).toBe(TOUR_STEP_TARGETS.FILTERS);
    expect(LIST_COMPLAINTS_SELECTORS.STEP_4).toBe(TOUR_STEP_TARGETS.FILTERS);
    expect(TRENDS_SELECTORS.STEP_4).toBe(TOUR_STEP_TARGETS.FILTERS);

    expect(GEO_STEP_SELECTORS.STEP_5).toBe(TOUR_STEP_TARGETS.DATE_RECEIVED);
    expect(LIST_COMPLAINTS_SELECTORS.STEP_5).toBe(
      TOUR_STEP_TARGETS.DATE_RECEIVED,
    );
    expect(TRENDS_SELECTORS.STEP_5).toBe(TOUR_STEP_TARGETS.DATE_RECEIVED);
  });
});
