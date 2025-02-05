import './Tour.scss';
import * as d3 from 'd3';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectViewIsPrintMode,
  selectViewShowTour,
  selectViewTab,
  selectViewWidth,
} from '../../reducers/view/selectors';
import { Steps } from 'intro.js-react';
import { TOUR_STEPS } from './constants/tourStepsConstants';
import { TourButton } from './TourButton';
import { tourHidden } from '../../reducers/view/viewSlice';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';
import { useGetMap } from '../../api/hooks/useGetMap';
import { useGetList } from '../../api/hooks/useGetList';
import { useGetTrends } from '../../api/hooks/useGetTrends';

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
  const isLoading = [
    aggsLoading,
    aggsFetching,
    mapLoading,
    mapFetching,
    resultsLoading,
    resultsFetching,
    trendsLoading,
    trendsFetching,
  ].some((val) => val);

  const mobileStepOpen = {
    disableInteraction: false,
    element: '.filter-panel-toggle .m-btn-group .a-btn',
    intro:
      'On mobile devices, click the Filter Panel toggle button to open the Filter Panel. Please click the button to proceed.',
  };
  const mobileStepClose = {
    disableInteraction: false,
    element: '.filter-panel-toggle .m-btn-group .a-btn',
    intro:
      'Click the Filter Panel toggle button again to close the Filter Panel. Please close the Filter Panel to proceed.',
  };

  const steps =
    viewWidth < 750
      ? TOUR_STEPS[tab]
          .slice(0, 3)
          .concat(
            mobileStepOpen,
            TOUR_STEPS[tab].slice(4, 7),
            mobileStepClose,
            TOUR_STEPS[tab].slice(7),
          )
      : TOUR_STEPS[tab];

  // INTRODUCTION / TUTORIAL OPTIONS:
  const options = {
    disableInteraction: true,
    scrollToElement: true,
    scrollTo: 'tooltip',
    showStepNumbers: false,
    exitOnOverlayClick: false,
    exitOnEsc: true,
    nextLabel: 'Next',
    prevLabel: 'Previous',
    doneLabel: 'End Tour',
    steps: steps,
  };

  /**
   * Before Change handler
   *
   * @param {object} ref - React component reference.
   */
  function handleBeforeChange(ref) {
    if (!ref.current) {
      // early exit, tour not set
      return;
    }
    const currentStep = ref.current.introJs.currentStep();

    // exit out when we're on last step and keyboard nav pressed
    if (!steps[currentStep]) {
      return;
    }

    if (steps[currentStep].element === '.row-chart-section') {
      // when the tour is initiated, we reset the chart so that the
      // rows are collapsed. This way we can click the first row to expand it
      // to guarantee a consistent tour.
      const expandable = d3.select('#row-chart-product .tick.expandable');
      expandable.dispatch('click');
    }

    // Add listener to filter toggle if it's mobile and at step 4 or 7
    const filterListener = () => {
      // Make sure next button isn't being hidden from steps 3 or 7
      document
        .querySelector('.introjs-nextbutton')
        ?.setAttribute('style', 'display: inline');
      // Wait for date inputs to render, then proceed
      const promise = new Promise((resolve) => {
        if (currentStep === 7) return resolve();
        const interval = setInterval(() => {
          if (document.querySelector('.date-filter') !== null) {
            clearInterval(interval);
            return resolve();
          }
        }, 10);
      });
      promise.then(() => {
        ref.current.introJs.nextStep().then(() => {
          document
            .querySelector(mobileStepOpen.element)
            .removeEventListener('click', filterListener);
        });
      });
    };
    if (viewWidth < 750 && (currentStep === 3 || currentStep === 7)) {
      document
        .querySelector('.introjs-nextbutton')
        .setAttribute('style', 'display: none');
      document
        .querySelector(mobileStepOpen.element)
        .addEventListener('click', filterListener);
    }
  }

  /**
   * Exit handler
   *
   * @param {object} ref - React component reference.
   * @returns {boolean} Can we exit?
   */
  function handleBeforeExit(ref) {
    if (ref.current === null || !showTour) {
      return true;
    }
    if (ref.current.introJs.currentStep() + 1 < steps.length) {
      return window.confirm('Are you sure you want to exit the tour?');
    }
    return true;
  }

  /**
   * wrapper function to only hide tour when it is visible
   */
  function hideTour() {
    if (showTour) {
      dispatch(tourHidden());
    }
  }

  return isPrintMode || isLoading ? null : (
    <>
      <TourButton />
      <Steps
        enabled={showTour}
        initialStep={0}
        steps={steps}
        onExit={() => hideTour()}
        options={options}
        onBeforeChange={() => handleBeforeChange(stepRef)}
        onBeforeExit={() => handleBeforeExit(stepRef)}
        ref={stepRef}
      />
    </>
  );
};
