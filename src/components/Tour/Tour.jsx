import './Tour.less';
import * as d3 from 'd3'
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { selectQueryTab } from '../../reducers/query/selectors';
import { selectViewIsTourEnabled } from '../../reducers/view/selectors';
import { Steps } from 'intro.js-react';
import { TOUR_STEPS } from './constants/tourStepsConstants';
import { TourButton } from './TourButton';
import { tourToggled } from '../../actions/trends';

export const Tour = () => {
  const dispatch = useDispatch();
  const isTourEnabled = useSelector( selectViewIsTourEnabled );
  const tab = useSelector( selectQueryTab );
  const steps = TOUR_STEPS[tab]
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
    steps: steps
  };

    /**
     * On Start handler
     *
     */
  function handleOnStart() {
    if (
            [ 'MODE_HISTORY' ].includes( tab )
        ) {
      // dispatch( changeRoute( '/' + indexPath + '/q', query ) );
    }
  }


  /**
   * Before Change handler
   *
   * @param {object} ref - React component reference.
   */
  function handleBeforeChange( ref ) {
    const expand = ref.current.introJs.currentStep() + 1;

    if ( expand === 9 ) {
      document.querySelector( '.advanced-container button' ).click()
    }

    if ( expand === 16 ) {
      // figure out how many expandables there are
      // figure out how many ticks there are.
      // if not equal, it means one is open so we don't need to expand a tick
      const expandables = document.querySelectorAll( '#row-chart-product .y-axis-group .tick.expandable' );
      const ticks = document.querySelectorAll( '#row-chart-product .y-axis-group .tick' );
      if ( ticks.length === expandables.length ) {
        const ee = d3.select( '#row-chart-product .tick.expandable' );
        ee.dispatch( 'click' );
      }
    }

    const callBack = () => {
      steps.forEach( ( step, i ) => {
        if ( ref.current !== null ) {
          ref.current.updateStepElement( i );
        }
      } );
    };
    const waitOn = new MutationObserver( callBack );
    waitOn.observe( document, { subtree: true, childList: true } );
  }

  /**
   * Exit handler
   *
   * @param {object} ref - React component reference.
   * @returns {boolean} Can we exit?
   */
  function handleBeforeExit( ref ) {
    if ( ref.current === null ) {
      return true;
    }
    if ( ref.current.introJs.currentStep() + 1 < steps.length ) {
      // eslint-disable-next-line no-alert
      return window.confirm( 'Are you sure you want to exit the tour?' );
    }
    return true;
  }

  return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <>
        <TourButton />
        <Steps
            enabled={isTourEnabled}
            initialStep={0}
            steps={steps}
            onStart={handleOnStart}
            onExit={() => dispatch( tourToggled( false ) )}
            options={options}
            onBeforeChange={() => handleBeforeChange( stepRef )}
            onBeforeExit={() => handleBeforeExit( stepRef )}
            ref={stepRef}
        />
      </>
  );
};