import './TourButton.less';
import iconMap from '../iconMap';
import React from 'react';
import { tourToggled } from '../../actions/trends';
import { useDispatch } from 'react-redux';

export const TourButton = () => {
  const dispatch = useDispatch();

  return <button
    onClick={() => dispatch( tourToggled( true ) )}
    className={'tour-button'}
  >
    { iconMap.getIcon( 'help-round' ) }
    Take a tour
  </button>
}
