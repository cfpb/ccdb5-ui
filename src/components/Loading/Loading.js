import './Loading.scss';
import { Icon } from '@cfpb/design-system-react';
import PropTypes from 'prop-types';

export const Loading = ({ isLoading }) => {
  return isLoading ? (
    <section className="light-box">
      <div className="loading-box">
        <Icon name="updating" isPresentational />{' '}
        <span>This page is loading</span>
      </div>
    </section>
  ) : null;
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
