import './Tour.less';
import * as d3 from 'd3';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectQueryTab } from '../../reducers/query/selectors';
import {
  selectViewIsPrintMode,
  selectViewShowTour,
} from '../../reducers/view/selectors';
import { Steps } from 'intro.js-react';
import { TOUR_STEPS } from './constants/tourStepsConstants';
import { TourButton } from './TourButton';
import { tourHidden } from '../../reducers/view/view';

export const Tour = () => {
  const dispatch = useDispatch();
  const showTour = useSelector(selectViewShowTour);
  const tab = useSelector(selectQueryTab);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const steps = TOUR_STEPS[tab];
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
      steps.forEach((step, i) => {
        if (ref.current !== null) {
          ref.current.updateStepElement(i);
        }
      });
    };
    const waitOn = new MutationObserver(callBack);
    waitOn.observe(document, { subtree: true, childList: true });
  }

  /**
   * Exit handler
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
