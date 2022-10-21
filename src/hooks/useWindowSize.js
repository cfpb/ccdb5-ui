// adapted from https://usehooks.com/useWindowSize/
import { debounce } from '../utils';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { screenResized } from '../actions/view';

// Hook
/**
 * Get the current size of the browser window.
 */
export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  const dispatch = useDispatch();
  useEffect(() => {
    // Handler to call on window resize
    const debouncedResized = debounce(() => {
      dispatch(screenResized(window.innerWidth));
    }, 500);
    // Add event listener
    window.addEventListener('resize', debouncedResized);
    // Call handler right away so state gets updated with initial window size
    debouncedResized();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', debouncedResized);
  }, [dispatch]); // Empty array ensures that effect is only run on mount
}
