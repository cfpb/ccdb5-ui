import './Loading.scss';
import getIcon from '../Common/Icon/iconMap';
import PropTypes from 'prop-types';

export const Loading = ({ isLoading }) => {
  return isLoading ? (
    <section className="light-box">
      <div className="loading-box">
        {getIcon('updating')} <span>This page is loading</span>
      </div>
    </section>
  ) : null;
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
