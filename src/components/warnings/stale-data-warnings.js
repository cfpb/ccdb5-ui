import { Warning } from './warning';
import { useGetAggregations } from '../../api/hooks/use-get-aggregations';
import { isTrue } from '../../utils';

export const WARN_DATA_ISSUE =
  'We’re currently experiencing technical issues that' +
  ' have delayed the refresh of data on the Consumer Complaint Database.  We' +
  ' expect to refresh the data in the next few days.';

export const StaleDataWarnings = () => {
  const { data } = useGetAggregations();
  const hasDataIssue = data?.hasDataIssue;
  const isDataStale = data?.isDataStale;
  const hasError = isTrue([hasDataIssue, isDataStale]);

  if (!hasError) return null;
  return (
    <div>
      <Warning text={WARN_DATA_ISSUE} />
    </div>
  );
};
