import { useEffect } from 'react';

/**
 * This hook allows us to add any window event listener on app load
 * Borrowed code from
 * https://atomizedobjects.com/blog/react/add-event-listener-react-hooks/
 *
 * @param {string} event - event to listen to
 * @param {Function} handler - function to run
 * @param {boolean} passive - if true, means function will never call preventDefault
 */
export function useEvent(event, handler, passive = false) {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener(event, handler, passive);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener(event, handler);
    };
  });
}
