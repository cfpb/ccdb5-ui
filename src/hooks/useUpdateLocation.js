import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { changeRoute } from '../actions/routes';

/**
 * Hook to dispatch route changes to sync url and state.
 * we only run this on init so we have the page fire API queries
 */
export function useUpdateLocation() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(
      changeRoute(location.pathname, queryString.parse(location.search)),
    );
  }, [location, dispatch]);
}
