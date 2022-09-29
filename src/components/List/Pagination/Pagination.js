import { nextPageShown, prevPageShown } from '../../actions/paging';
import { useDispatch, useSelector } from 'react-redux';
import iconMap from '../iconMap';
import { IntlProvider } from 'react-intl';
import React from 'react';
import {
  selectQueryPage,
  selectQueryTotalPages,
} from '../../reducers/query/selectors';

export const Pagination = () => {
  const dispatch = useDispatch();
  const page = useSelector(selectQueryPage);
  const total = useSelector(selectQueryTotalPages) || 1;

  const nextPage = () => {
    dispatch(nextPageShown());
  };
  const prevPage = () => {
    dispatch(prevPageShown());
  };

  return (
    <IntlProvider locale="en">
      <nav className="m-pagination" role="navigation" aria-label="Pagination">
        <button
          className="a-btn m-pagination_btn-prev"
          onClick={() => prevPage()}
          disabled={page <= 1}
        >
          <span className="a-btn_icon a-btn_icon__on-left">
            {iconMap.getIcon('left')}
          </span>
          Previous
        </button>
        <button
          className="a-btn m-pagination_btn-next"
          onClick={() => nextPage()}
          disabled={page >= total}
        >
          Next
          <span
            className="a-btn_icon
                             a-btn_icon__on-right"
          >
            {iconMap.getIcon('right')}
          </span>
        </button>
        <div className="m-pagination_form">
          <label className="m-pagination_label">Page {page}</label>
        </div>
      </nav>
    </IntlProvider>
  );
};
