import './TourButton.less';
import getIcon from '../iconMap';
import React from 'react';
import { useDispatch } from 'react-redux';
import { tourShown } from '../../reducers/view/view';

export const TourButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(tourShown())} className="a-btn tour-button">
      {getIcon('help-round')} Take a tour
    </button>
  );
};
