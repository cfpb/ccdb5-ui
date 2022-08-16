import './Tour.less';
import React, { useRef } from 'react';
import { selectQueryTab } from '../../reducers/query/selectors';
import { Steps } from 'intro.js-react';
import { TOUR_STEPS } from './constants/tourStepsConstants';
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux'

export const Tour = () => {
  // const dispatch = useDispatch();
  // const tour = useSelector( selectViewModelTour );
  const tab = useSelector( selectQueryTab );
  // const query = useSelector( selectQueryQueryText );
  // const indexPath = useSelector( selectViewModelIndexPath );

  console.log( tab )
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

    return false;
  }

  return (
      // eslint-disable-next-line react/react-in-jsx-scope
        <Steps
            enabled={true}
            initialStep={0}
            steps={steps}
            onStart={handleOnStart}
            onExit={() => { console.log( 'exiting' ) }}
            options={options}
            onBeforeChange={() => handleBeforeChange( stepRef )}
            onBeforeExit={() => handleBeforeExit( stepRef )}
            ref={stepRef}
        />
  );
};
