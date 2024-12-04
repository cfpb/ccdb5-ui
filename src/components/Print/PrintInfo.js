import './PrintInfo.scss';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { shortFormat } from '../../utils';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQuerySearchText,
} from '../../reducers/query/selectors';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';

export const PrintInfo = () => {
  const { data } = useGetAggregations();
  const dateMin = useSelector(selectQueryDateReceivedMin);
  const dateMax = useSelector(selectQueryDateReceivedMax);
  const dateText = shortFormat(dateMin) + ' - ' + shortFormat(dateMax);

  const searchText = useSelector(selectQuerySearchText);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const docCount = data?.doc_count || 0;
  const total = data?.total || 0;

  const complaintCountText = useMemo(() => {
    if (docCount === total) {
      return (
        <div>
          Showing <span>{total.toLocaleString()}</span> complaints
        </div>
      );
    }
    return (
      <div>
        Showing <span>{total.toLocaleString()}</span> out of
        <span> {docCount.toLocaleString()} </span> total complaints{' '}
      </div>
    );
  }, [docCount, total]);

  return isPrintMode ? (
    <section className="print-info">
      <p>
        <span>Dates:</span> {dateText}
      </p>
      {!!searchText && (
        <p>
          <span>Search Term:</span> {searchText}
        </p>
      )}
      <div>{complaintCountText}</div>
    </section>
  ) : null;
};
