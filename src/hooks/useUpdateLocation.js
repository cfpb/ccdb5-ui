import { useEffect } from 'react';
import {useDispatch} from 'react-redux';
import announceUrlChanged from "../actions/url";
import { useLocation } from 'react-router-dom';

/**
 * Hook to dispatch route changes to sync url and state.
 * we only run this on init so we have the page fire API queries
 */
export default function useUpdateLocation() {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(announceUrlChanged(location));
  }, []);
}
