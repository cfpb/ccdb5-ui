import './TourButton.less';
import iconMap from '../iconMap';
import React from 'react';
import { tourShown } from '../../actions/view';
import { useDispatch } from 'react-redux';

export const TourButton = () => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(tourShown())}
      className="a-btn tour-button"
    >
      {iconMap.getIcon('help-round')} Take a tour
    </button>
  );
};
