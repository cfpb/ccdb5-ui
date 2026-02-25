import './ComplaintDetail.scss';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { useGetDocumentQuery } from '../../api/complaints';
import { Link } from '@cfpb/design-system-react';
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
          <Link
            href={backUrl}
            isJump
            isRouterLink
            iconLeft="left"
            label="Back to search results"
          />
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
