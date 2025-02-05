import './ComplaintDetail.scss';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useGetDocumentQuery } from '../../api/complaints';
import getIcon from '../Common/Icon/iconMap';
import { Loading } from '../Loading/Loading';
import { selectRoutesParams } from '../../reducers/routes/selectors';
import { ComplaintDetailBody } from './ComplaintDetailBody';
import { LINK_DATA_USE } from '../../constants';
import { formatUri } from '../../utils';

export const ComplaintDetail = () => {
  const location = useLocation();
  const { id } = useParams();

  const params = useSelector(selectRoutesParams);
  const backUrl = useMemo(() => {
    // exit out if not initialized
    if (!location) {
      return '';
    }

    const pathName = location.pathname;
    const idx = pathName.indexOf('detail');
    return formatUri(pathName.substring(0, idx), params);
  }, [location, params]);

  const { data, isLoading, error } = useGetDocumentQuery(id);

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
