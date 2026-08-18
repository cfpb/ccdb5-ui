import { TOUR_STEP_TARGETS as STEP } from './tour-selector-constants';

export { TOUR_SELECTORS, TOUR_STEP_TARGETS } from './tour-selector-constants';

export const DOCUMENT_STEP_SELECTORS = {
  STEP_1: '.content__hero',
  STEP_2: '.m-pagination__btn-next',
  STEP_3: '.saved__search-panel div:nth-child(2)',
  STEP_4: '.back-to-results',
};

export const LIST_COMPLAINTS_SELECTORS = {
  STEP_1: STEP.INDEX,
  STEP_2: STEP.HELP_LINKS,
  STEP_3: STEP.FILTERS,
  STEP_4: STEP.DATE_RECEIVED,
  STEP_5: STEP.PRODUCT_ISSUE,
  STEP_6: STEP.SHOW_HIDE,
  STEP_7: STEP.SEARCH_BAR,
  STEP_8: STEP.SEARCH_SUMMARY,
  STEP_9: STEP.EXPORT_DATA,
  STEP_10: STEP.SELECT_SIZE,
  STEP_11: STEP.SELECT_SORT,
  STEP_12: STEP.RESULTS,
  STEP_13: STEP.COMPLAINT_DETAIL,
};
