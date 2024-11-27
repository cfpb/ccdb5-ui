import { useGetMapQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractAggregationParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import { selectQueryRoot } from '../../reducers/query/selectors';
import { selectViewTab } from '../../reducers/view/selectors';
import { MODE_MAP } from '../../constants';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';

export const useGetMap = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const tab = useSelector(selectViewTab);
  const qs = useSelector(selectRoutesQueryString);

  const queryParams = extractAggregationParams(filters, query);
  return useGetMapQuery(queryParams, {
    skip: tab !== MODE_MAP || qs === '',
  });
};
