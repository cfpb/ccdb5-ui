import {
  nextPageShown,
  prevPageShown,
} from '../../../reducers/query/querySlice';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../../iconMap';
import {
  selectQueryPage,
  selectQueryTotalPages,
} from '../../../reducers/query/selectors';
import { selectResultsItems } from '../../../reducers/results/selectors';

export const Pagination = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectQueryPage);
  const total = useSelector(selectQueryTotalPages);
  const items = useSelector(selectResultsItems);

  const nextPage = () => {
    dispatch(nextPageShown());
  };
  const prevPage = () => {
    dispatch(prevPageShown());
  };

  return items.length > 0 ? (
    <nav className="m-pagination" role="navigation" aria-label="Pagination">
      <button
        className="a-btn m-pagination__btn-prev"
        onClick={() => prevPage()}
        disabled={page <= 1}
      >
        <span className="a-btn__icon a-btn__icon--on-left">
          {getIcon('left')}
        </span>
        Previous
      </button>
      <button
        className="a-btn m-pagination__btn-next"
        onClick={() => nextPage()}
        disabled={page >= total}
      >
        Next
        <span
          className="a-btn__icon
                             a-btn__icon--on-right"
        >
          {getIcon('right')}
        </span>
      </button>
      <div className="m-pagination__form">
        <label className="m-pagination__label">Page {page}</label>
      </div>
    </nav>
  ) : null;
};
