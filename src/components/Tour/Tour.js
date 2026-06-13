import './Tour.scss';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectViewIsPrintMode,
  selectViewShowTour,
  selectViewTab,
  selectViewWidth,
} from '../../reducers/view/selectors';
import { BP_SM_SPLIT_WIDE_MIN } from '../../constants/breakpoints';
import { TOUR_STEPS } from './constants/tourStepsConstants';
import { TOUR_INTRO_OPTIONS } from './constants/tourIntroOptions';
import { TOUR_SELECTORS } from './constants/tourSelectorConstants';
import { TourButton } from './TourButton';
import { TourSteps } from './TourSteps';
import { tourHidden } from '../../reducers/view/viewSlice';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';
import { useGetMap } from '../../api/hooks/useGetMap';
import { useGetList } from '../../api/hooks/useGetList';
import { useGetTrends } from '../../api/hooks/useGetTrends';
import { isTrue } from '../../utils';
import { querySelector } from '../../utils/dom';

const MOBILE_FILTER_TOGGLE_SELECTOR = TOUR_SELECTORS.MOBILE_FILTER_TOGGLE;

const ROW_CHART_SECTION_SELECTOR = TOUR_SELECTORS.ROW_CHART_SECTION;
const MAP_ROW_CHART_SECTION_SELECTOR = TOUR_SELECTORS.MAP_ROW_CHART_SECTION;

const isRowChartStep = (selector) =>
  selector === ROW_CHART_SECTION_SELECTOR ||
  selector === MAP_ROW_CHART_SECTION_SELECTOR;

const prepareRowChartStep = () => {
  const rowChartSection =
    querySelector(MAP_ROW_CHART_SECTION_SELECTOR) ||
    querySelector(ROW_CHART_SECTION_SELECTOR);
  rowChartSection?.scrollIntoView({ block: 'center' });
  requestAnimationFrame(() => {
    const expandable = querySelector(TOUR_SELECTORS.ROW_CHART_EXPANDABLE);
    expandable?.click();
  });
};

const DATE_FILTER_POLL_MS = 10;
const DATE_FILTER_MAX_WAIT_MS = 5000;

// Mobile tour inserts MOBILE_STEP_OPEN at index 3 and MOBILE_STEP_CLOSE at index 7
// (after slice(0, 3), slice(4, 7), slice(7) of the desktop step list).
const MOBILE_FILTER_OPEN_STEP_INDEX = 3;
const MOBILE_FILTER_CLOSE_STEP_INDEX = 7;

const MOBILE_STEP_OPEN = {
  disableInteraction: false,
  element: MOBILE_FILTER_TOGGLE_SELECTOR,
  intro:
    'On mobile devices, click the Filter Panel toggle button to open the Filter Panel. Please click the button to proceed.',
};

const MOBILE_STEP_CLOSE = {
  disableInteraction: false,
  element: MOBILE_FILTER_TOGGLE_SELECTOR,
  intro:
    'Click the Filter Panel toggle button again to close the Filter Panel. Please close the Filter Panel to proceed.',
};

const waitForDateFilter = () =>
  new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (querySelector(TOUR_SELECTORS.DATE_FILTER) !== null) {
        clearInterval(interval);
        resolve();
        return;
      }
      if (Date.now() - start >= DATE_FILTER_MAX_WAIT_MS) {
        clearInterval(interval);
        resolve();
      }
    }, DATE_FILTER_POLL_MS);
  });

export const Tour = () => {
  const dispatch = useDispatch();
  const { isLoading: aggsLoading, isFetching: aggsFetching } =
    useGetAggregations();
  const { isLoading: mapLoading, isFetching: mapFetching } = useGetMap();
  const { isLoading: resultsLoading, isFetching: resultsFetching } =
    useGetList();
  const { isLoading: trendsLoading, isFetching: trendsFetching } =
    useGetTrends();

  const showTour = useSelector(selectViewShowTour);
  const tab = useSelector(selectViewTab);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const viewWidth = useSelector(selectViewWidth);
  const stepRef = useRef();
  // ORing all of these to prevent complexity warning
  const isLoading = isTrue([
    aggsLoading,
    aggsFetching,
    isPrintMode,
    mapLoading,
    mapFetching,
    resultsLoading,
    resultsFetching,
    trendsLoading,
    trendsFetching,
  ]);

  const isMobileTour = viewWidth < BP_SM_SPLIT_WIDE_MIN;

  const baseSteps = useMemo(
    () =>
      isMobileTour
        ? TOUR_STEPS[tab]
            .slice(0, 3)
            .concat(
              MOBILE_STEP_OPEN,
              TOUR_STEPS[tab].slice(4, 7),
              MOBILE_STEP_CLOSE,
              TOUR_STEPS[tab].slice(7),
            )
        : TOUR_STEPS[tab],
    [tab, isMobileTour],
  );

  const handleBeforeChange = useCallback(
    (ref) => {
      if (!ref.current) {
        return;
      }
      const currentStep = ref.current.introJs.currentStep();

      if (!baseSteps[currentStep]) {
        return;
      }

      if (isRowChartStep(baseSteps[currentStep]?.element)) {
        // Collapse row chart rows so the tour can expand the first row consistently.
        prepareRowChartStep();
      }

      const filterListener = () => {
        querySelector('.introjs-nextbutton')?.setAttribute(
          'style',
          'display: inline',
        );

        const afterFilterAction =
          currentStep === MOBILE_FILTER_CLOSE_STEP_INDEX
            ? Promise.resolve()
            : waitForDateFilter();

        afterFilterAction.then(() => {
          ref.current.introJs.nextStep().then(() => {
            querySelector(MOBILE_FILTER_TOGGLE_SELECTOR)?.removeEventListener(
              'click',
              filterListener,
            );
          });
        });
      };

      if (
        isMobileTour &&
        (currentStep === MOBILE_FILTER_OPEN_STEP_INDEX ||
          currentStep === MOBILE_FILTER_CLOSE_STEP_INDEX)
      ) {
        querySelector('.introjs-nextbutton')?.setAttribute(
          'style',
          'display: none',
        );
        querySelector(MOBILE_FILTER_TOGGLE_SELECTOR)?.addEventListener(
          'click',
          filterListener,
        );
      }
    },
    [baseSteps, isMobileTour],
  );

  const handleBeforeExit = useCallback(
    (ref) => {
      if (ref.current === null || !showTour) {
        return true;
      }
      if (ref.current.introJs.currentStep() + 1 < baseSteps.length) {
        return window.confirm('Are you sure you want to exit the tour?');
      }
      return true;
    },
    [baseSteps.length, showTour],
  );

  const hideTour = useCallback(() => {
    if (showTour) {
      dispatch(tourHidden());
    }
  }, [dispatch, showTour]);

  const onBeforeChange = useCallback(
    () => handleBeforeChange(stepRef),
    [handleBeforeChange],
  );

  const onBeforeExit = useCallback(
    () => handleBeforeExit(stepRef),
    [handleBeforeExit],
  );

  return isLoading ? null : (
    <>
      <TourButton />
      <TourSteps
        isEnabled={showTour}
        initialStep={0}
        steps={baseSteps}
        onExit={hideTour}
        options={TOUR_INTRO_OPTIONS}
        onBeforeChange={onBeforeChange}
        onBeforeExit={onBeforeExit}
        ref={stepRef}
      />
    </>
  );
};
