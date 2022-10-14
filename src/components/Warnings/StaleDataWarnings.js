import { useSelector } from 'react-redux';
import React from 'react';
import Warning from './Warning';
import {
  selectAggsHasDataIssue,
  selectAggsIsDataStale,
} from '../../reducers/aggs/selectors';

export const WARN_DATA_ISSUE =
  'We’re currently experiencing technical issues that' +
  ' have delayed the refresh of data on the Consumer Complaint Database.  We' +
  ' expect to refresh the data in the next few days.';

export const StaleDataWarnings = () => {
  const hasDataIssue = useSelector(selectAggsHasDataIssue);
  const isDataStale = useSelector(selectAggsIsDataStale);
  const hasError = hasDataIssue || isDataStale;

  if (!hasError) return null;
  return (
    <div>
      <Warning text={WARN_DATA_ISSUE} />
    </div>
  );
};
