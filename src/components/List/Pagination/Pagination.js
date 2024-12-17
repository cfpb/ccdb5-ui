import {
  nextPageShown,
  prevPageShown,
} from '../../../reducers/query/querySlice';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../../Common/Icon/iconMap';
import { selectQueryPage } from '../../../reducers/query/selectors';
import { useGetList } from '../../../api/hooks/useGetList';

export const Pagination = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectQueryPage);
  const { data } = useGetList();
  const items = data?.hits;
  const total = data?.totalPages || 0;
  const breakPoints = data?.breakPoints;

  const nextPage = () => {
    dispatch(nextPageShown(breakPoints));
  };
  const prevPage = () => {
    dispatch(prevPageShown(breakPoints));
  };

  return items && items.length > 0 ? (
    <nav className="m-pagination" role="navigation" aria-label="Pagination">
      <button
        className="a-btn m-pagination__btn-prev"
        onClick={() => prevPage()}
        disabled={page <= 1}
      >
        {getIcon('left')}
        <span>Previous</span>
      </button>
      <button
        className="a-btn m-pagination__btn-next"
        onClick={() => nextPage()}
        disabled={page >= total}
      >
        <span>Next</span>
        {getIcon('right')}
      </button>
      <div className="m-pagination__form">
        <label className="m-pagination__label">Page {page}</label>
      </div>
    </nav>
  ) : null;
};
