import { useGetListQuery } from '../complaints';
import { useSelector } from 'react-redux';
import { extractBasicParams } from '../params/params';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryDateLastIndexed,
  selectQueryRoot,
} from '../../reducers/query/selectors';
import { selectViewTab } from '../../reducers/view/selectors';
import { MODE_LIST } from '../../constants';
import { selectRoutesQueryString } from '../../reducers/routes/selectors';
import { isTrue } from '../../utils';

export const useGetList = () => {
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const tab = useSelector(selectViewTab);
  const qs = useSelector(selectRoutesQueryString);
  const queryParams = extractBasicParams(filters, query);
  const dateLastIndexed = useSelector(selectQueryDateLastIndexed);
  const shouldSkip = isTrue([tab !== MODE_LIST, qs === '', !dateLastIndexed]);
  return useGetListQuery(queryParams, {
    skip: shouldSkip,
  });
};
