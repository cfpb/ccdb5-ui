import './PrintInfo.less';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { shortFormat } from '../../utils';
import {
  selectAggsDocCount,
  selectAggsTotal,
} from '../../reducers/aggs/selectors';

import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQuerySearchText,
} from '../../reducers/query/selectors';
import { selectViewIsPrintMode } from '../../reducers/view/selectors';

export const PrintInfo = () => {
  const docCount = useSelector(selectAggsDocCount);
  const total = useSelector(selectAggsTotal);

  const dateMin = useSelector(selectQueryDateReceivedMin);
  const dateMax = useSelector(selectQueryDateReceivedMax);
  const dateText = shortFormat(dateMin) + ' - ' + shortFormat(dateMax);

  const searchText = useSelector(selectQuerySearchText);
  const isPrintMode = useSelector(selectViewIsPrintMode);

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
