// adapted from https://usehooks.com/useWindowSize/
import { debounce } from '../utils';
import { useEffect } from 'react';
import { updateScreenSize } from '../reducers/view/view-slice';
import { selectViewWidth } from '../reducers/view/selectors';
import { useAppDispatch, useAppSelector } from '../app/hooks';

/**
 * Keep the view width in Redux in sync with the browser window size.
 */
export function useWindowSize(): void {
  const viewWidth = useAppSelector(selectViewWidth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const debouncedResized = debounce(() => {
      if (viewWidth !== window.innerWidth) {
        dispatch(updateScreenSize(window.innerWidth));
      }
    }, 500);
    window.addEventListener('resize', debouncedResized);
    debouncedResized();
    return () => window.removeEventListener('resize', debouncedResized);
  }, [dispatch, viewWidth]);
}
