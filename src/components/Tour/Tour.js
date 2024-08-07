import './Tour.less';
import * as d3 from 'd3';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectQueryTab } from '../../reducers/query/selectors';
import {
  selectViewIsPrintMode,
  selectViewShowTour,
  selectViewWidth,
} from '../../reducers/view/selectors';
import { Steps } from 'intro.js-react';
import { TOUR_STEPS } from './constants/tourStepsConstants';
import { TourButton } from './TourButton';
import { tourHidden } from '../../actions/view';

export const Tour = () => {
  const dispatch = useDispatch();
  const showTour = useSelector(selectViewShowTour);
  const tab = useSelector(selectQueryTab);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const viewWidth = useSelector(selectViewWidth);

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
  const stepRef = useRef();

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

    const callBack = () => {
      steps.forEach((step, idx) => {
        if (ref.current !== null) {
          ref.current.updateStepElement(idx);
        }
      });
    };
    const waitOn = new MutationObserver(callBack);
    waitOn.observe(document.querySelector('#ccdb-ui-root'), {
      subtree: true,
      childList: true,
    });

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
    if (ref.current === null) {
      return true;
    }
    if (ref.current.introJs.currentStep() + 1 < steps.length) {
      // eslint-disable-next-line no-alert
      return window.confirm('Are you sure you want to exit the tour?');
    }
    return true;
  }

  return isPrintMode ? null : (
    // eslint-disable-next-line react/react-in-jsx-scope
    <>
      <TourButton />
      <Steps
        enabled={showTour}
        initialStep={0}
        steps={steps}
        onExit={() => dispatch(tourHidden())}
        options={options}
        onBeforeChange={() => handleBeforeChange(stepRef)}
        onBeforeExit={() => handleBeforeExit(stepRef)}
        ref={stepRef}
      />
    </>
  );
};
