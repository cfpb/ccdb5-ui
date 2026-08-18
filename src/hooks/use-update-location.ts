import { useEffect } from 'react';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { changeRoute } from '../actions/routes';
import { useAppDispatch } from '../app/hooks';

/**
 * Dispatch route changes so URL and Redux stay in sync.
 * Runs when the location changes so the page can fire API queries.
 */
export function useUpdateLocation(): void {
  const dispatch = useAppDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(
      changeRoute(location.pathname, queryString.parse(location.search)),
    );
  }, [location, dispatch]);
}
