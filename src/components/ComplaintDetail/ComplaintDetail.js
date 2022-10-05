import './ComplaintDetail.less';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDetailActiveCall,
  selectDetailData,
  selectDetailError,
} from '../../reducers/detail/selectors';
import { Link, useParams } from 'react-router-dom';
import { getComplaintDetail } from '../../actions/complaints';
import iconMap from '../iconMap';
import Loading from '../Dialogs/Loading';
import { selectQueryUrl } from '../../reducers/query/selectors';
import { ComplaintDetailBody } from './ComplaintDetailBody';

const getRootUrl = () => {
  const fullPath = window.location.pathname;
  const idx = fullPath.indexOf('detail');
  return fullPath.substring(0, idx);
};

export const ComplaintDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(selectDetailData);
  const error = useSelector(selectDetailError);
  const activeCall = useSelector(selectDetailActiveCall);
  const previousUrl = useSelector(selectQueryUrl);

  const isLoading = activeCall !== '';
  const pUrl = getRootUrl() + previousUrl;

  useEffect(() => {
    dispatch(getComplaintDetail(id));
  }, [dispatch, id]);

  return (
    <section className="card-container">
      <nav className="layout-row">
        <div className="back-to-search flex-fixed">
          <Link to={pUrl}>
            {iconMap.getIcon('left', 'cf-icon-left')}
            Back to search results
          </Link>
        </div>
        <div className="meaning flex-fixed">
          <a
            href="https://www.consumerfinance.gov/complaint/data-use/"
            target="_blank"
            rel="noopener noreferrer"
          >
            What do all these data points mean?
          </a>
        </div>
      </nav>
      {isLoading ? (
        <Loading isLoading={true} />
      ) : (
        <ComplaintDetailBody data={data} error={error} id={id} />
      )}
    </section>
  );
};
