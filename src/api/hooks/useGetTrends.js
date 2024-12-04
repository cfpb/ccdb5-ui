import { useGetTrendsQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractTrendsParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import { selectQueryRoot } from '../../reducers/query/selectors';
import { selectViewTab } from '../../reducers/view/selectors';
import { MODE_TRENDS } from '../../constants';
import { selectTrendsRoot } from '../../reducers/trends/selectors';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';

export const useGetTrends = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const trends = useSelector(selectTrendsRoot);
  const tab = useSelector(selectViewTab);
  const qs = useSelector(selectRoutesQueryString);

  const queryParams = extractTrendsParams(filters, query, trends);
  return useGetTrendsQuery(queryParams, {
    skip: tab !== MODE_TRENDS || qs === '',
  });
};
