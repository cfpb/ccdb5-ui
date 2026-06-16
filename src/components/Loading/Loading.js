import './Loading.scss';
import { Icon } from '@cfpb/design-system-react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { getOverlayPortalParent } from '../../utils/dom';

export const Loading = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return createPortal(
    <section className="light-box" aria-busy="true" aria-live="polite">
      <div className="loading-box">
        <Icon name="updating" isPresentational />{' '}
        <span>This page is loading</span>
      </div>
    </section>,
    getOverlayPortalParent(),
  );
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
