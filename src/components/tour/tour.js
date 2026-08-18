import './tour.scss';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectViewIsPrintMode,
  selectViewShowTour,
  selectViewWidth,
} from '../../reducers/view/selectors';
import { BP_SM_SPLIT_WIDE_MIN } from '../../constants/breakpoints';
import { TOUR_STEPS } from './constants/tour-steps-constants';
import { TOUR_INTRO_OPTIONS } from './constants/tour-intro-options';
import { TOUR_SELECTORS } from './constants/tour-selector-constants';
import { TourButton } from './tour-button';
import { TourSteps } from './tour-steps';
import { tourHidden } from '../../reducers/view/view-slice';
import { usePageLoading } from '../../api/hooks/use-page-loading';
import { isTrue } from '../../utils';
import { querySelector } from '../../utils/dom';

const MOBILE_FILTER_TOGGLE_SELECTOR = TOUR_SELECTORS.MOBILE_FILTER_TOGGLE;

const DATE_FILTER_POLL_MS = 10;
const DATE_FILTER_MAX_WAIT_MS = 5000;

// Mobile tour inserts MOBILE_STEP_OPEN at index 2 and MOBILE_STEP_CLOSE at index 6
// (after slice(0, 2), slice(3, 6), slice(6) of the desktop step list).
const MOBILE_FILTER_OPEN_STEP_INDEX = 2;
const MOBILE_FILTER_CLOSE_STEP_INDEX = 6;

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
  const isPageLoading = usePageLoading();
  const showTour = useSelector(selectViewShowTour);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const viewWidth = useSelector(selectViewWidth);
  const stepRef = useRef();
  const isLoading = isTrue([isPageLoading, isPrintMode]);

  const isMobileTour = viewWidth < BP_SM_SPLIT_WIDE_MIN;

  const baseSteps = useMemo(
    () =>
      isMobileTour
        ? [
            ...TOUR_STEPS.slice(0, 2),
            MOBILE_STEP_OPEN,
            ...TOUR_STEPS.slice(3, 6),
            MOBILE_STEP_CLOSE,
            ...TOUR_STEPS.slice(6),
          ]
        : TOUR_STEPS,
    [isMobileTour],
  );

  const handleBeforeChange = useCallback(
    (ref) => {
      if (!ref.current) {
        return;
      }
      const currentStep = ref.current.introJs.currentStep();

      if (!Object.hasOwn(baseSteps, currentStep)) {
        return;
      }

      const filterListener = async () => {
        querySelector('.introjs-nextbutton')?.setAttribute(
          'style',
          'display: inline',
        );

        const afterFilterAction =
          currentStep === MOBILE_FILTER_CLOSE_STEP_INDEX
            ? Promise.resolve()
            : waitForDateFilter();

        await afterFilterAction;
        await ref.current.introJs.nextStep();
        querySelector(MOBILE_FILTER_TOGGLE_SELECTOR)?.removeEventListener(
          'click',
          filterListener,
        );
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
      if (!showTour || ref.current === null) {
        return true;
      }
      if (ref.current.introJs.currentStep() + 1 < baseSteps.length) {
        return confirm('Are you sure you want to exit the tour?');
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
