import './action-bar.scss';
import { Alert } from '@cfpb/design-system-react';
import { StaleDataWarnings } from '../warnings/stale-data-warnings';
import { useGetAggregations } from '../../api/hooks/use-get-aggregations';

/**
 * @param {number} total - Matching complaint count
 * @param {number} docCount - Total complaints in the dataset
 * @returns {string} Summary message for the search results alert
 */
const buildSummaryMessage = (total, docCount) => {
  if (total === docCount) {
    return 'Showing ' + docCount.toLocaleString() + ' total complaints';
  }
  return (
    'Showing ' +
    total.toLocaleString() +
    ' matches out of ' +
    docCount.toLocaleString() +
    ' total complaints'
  );
};

export const ActionBar = () => {
  const { data, error, isLoading, isFetching } = useGetAggregations();
  const isPending = isLoading || isFetching;
  const docCount = error ? 0 : data?.doc_count || 0;
  const total = error ? 0 : data?.total || 0;

  const message =
    isPending && !data
      ? 'Loading complaint counts…'
      : buildSummaryMessage(total, docCount);

  return (
    <div className="search-status">
      <Alert
        id="search-summary"
        className="action-bar"
        status={isPending ? 'loading' : 'success'}
        message={message}
      />
      <StaleDataWarnings />
    </div>
  );
};
