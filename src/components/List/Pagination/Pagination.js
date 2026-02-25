import {
  nextPageShown,
  prevPageShown,
} from '../../../reducers/query/querySlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@cfpb/design-system-react';
import { selectQueryPage } from '../../../reducers/query/selectors';
import { useGetList } from '../../../api/hooks/useGetList';

export const Pagination = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectQueryPage);
  const { data, error } = useGetList();
  const items = data?.hits;
  const total = data?.totalPages || 0;
  const breakPoints = data?.breakPoints;

  const nextPage = () => {
    dispatch(nextPageShown(breakPoints));
  };
  const prevPage = () => {
    dispatch(prevPageShown(breakPoints));
  };

  return !error && items && items.length > 0 ? (
    <nav className="m-pagination" role="navigation" aria-label="Pagination">
      <Button
        label="Previous"
        iconLeft="left"
        className="a-btn m-pagination__btn-prev"
        onClick={() => prevPage()}
        disabled={page <= 1}
      />
      <Button
        label="Next"
        iconRight="right"
        className="a-btn m-pagination__btn-next"
        onClick={() => nextPage()}
        disabled={page >= total}
      />
      <div className="m-pagination__form">
        <label className="m-pagination__label">Page {page}</label>
      </div>
    </nav>
  ) : null;
};
