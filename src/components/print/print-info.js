import './print-info.scss';
import { useSelector } from 'react-redux';
import { shortFormat } from '../../utils';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQuerySearchText,
} from '../../reducers/query/selectors';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';
import { useGetAggregations } from '../../api/hooks/use-get-aggregations';

export const PrintInfo = () => {
  const { data, error } = useGetAggregations();
  const dateMin = useSelector(selectQueryDateReceivedMin);
  const dateMax = useSelector(selectQueryDateReceivedMax);
  const dateText = shortFormat(dateMin) + ' - ' + shortFormat(dateMax);

  const searchText = useSelector(selectQuerySearchText);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const docCount = error ? 0 : data?.doc_count || 0;
  const total = error ? 0 : data?.total || 0;

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
      <div>
        {docCount === total ? (
          <div>
            Showing <span>{total.toLocaleString()}</span> complaints
          </div>
        ) : (
          <div>
            Showing <span>{total.toLocaleString()}</span> out of
            <span> {docCount.toLocaleString()} </span> total complaints{' '}
          </div>
        )}
      </div>
    </section>
  ) : null;
};
