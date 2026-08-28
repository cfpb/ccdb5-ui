import './complaint-detail.scss';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { useGetDocumentQuery } from '../../api/complaints';
import { Link } from '@cfpb/design-system-react';
import { Loading } from '../loading/loading';
import { selectRoutesParams } from '../../reducers/routes/selectors';
import { ComplaintDetailBody } from './complaint-detail-body';
import { LINK_DATA_USE } from '../../constants';
import { formatUri } from '../../utils';

export const ComplaintDetail = () => {
  const location = useLocation();
  const { id } = useParams();

  const params = useSelector(selectRoutesParams);
  const pathName = location?.pathname ?? '';
  const idx = pathName.indexOf('detail');
  const backUrl = location
    ? formatUri(pathName.slice(0, Math.max(0, idx)), params)
    : '';

  const { data, isLoading, error } = useGetDocumentQuery(id);

  return (
    <section className="complaint-detail">
      <nav className="complaint-detail__nav">
        <div className="complaint-detail__back-link">
          <Link to={backUrl} iconLeft="left" label="Back to search results" />
        </div>
        <div className="complaint-detail__meaning-link">
          <Link
            to={LINK_DATA_USE}
            target="_blank"
            rel="noopener noreferrer"
            label="What do all these data points mean?"
          />
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
