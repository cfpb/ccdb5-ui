import { useGetAggregationsQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractAggregationParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import { selectQueryRoot } from '../../reducers/query/selectors';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';

export const useGetAggregations = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const qs = useSelector(selectRoutesQueryString);
  const queryParams = extractAggregationParams(filters, query);
  return useGetAggregationsQuery(queryParams, {
    skip: qs === '',
  });
};
