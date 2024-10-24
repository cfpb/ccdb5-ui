import './ComplaintDetail.scss';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDetailActiveCall,
  selectDetailData,
  selectDetailError,
} from '../../reducers/detail/selectors';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getComplaintDetail } from '../../actions/complaints';
import getIcon from '../iconMap';
import { Loading } from '../Loading/Loading';
import { selectRoutesParams } from '../../reducers/routes/selectors';
import { ComplaintDetailBody } from './ComplaintDetailBody';
import { LINK_DATA_USE } from '../../constants';
import { formatUri } from '../../api/url/url';

export const ComplaintDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(selectDetailData);
  const error = useSelector(selectDetailError);
  const activeCall = useSelector(selectDetailActiveCall);
  const params = useSelector(selectRoutesParams);

  const isLoading = activeCall !== '';
  const backUrl = useMemo(() => {
    // exit out if not initialized
    if (!location) {
      return '';
    }

    const pathName = location.pathname;
    const idx = pathName.indexOf('detail');
    return formatUri(pathName.substring(0, idx), params);
  }, [location, params]);

  useEffect(() => {
    dispatch(getComplaintDetail(id));
  }, [dispatch, id]);

  return (
    <section className="card-container">
      <nav className="layout-row">
        <div className="back-to-search flex-fixed">
          <Link to={backUrl}>
            {getIcon('left', 'cf-icon-left')} Back to search results
          </Link>
        </div>
        <div className="meaning flex-fixed">
          <a href={LINK_DATA_USE} target="_blank" rel="noopener noreferrer">
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
