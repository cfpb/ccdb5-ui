import './TourButton.scss';
import getIcon from '../Common/Icon/iconMap';
import { useDispatch } from 'react-redux';
import { tourShown } from '../../reducers/view/viewSlice';

export const TourButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(tourShown())} className="a-btn tour-button">
      {getIcon('help-round')}
      <span>Take a tour</span>
    </button>
  );
};
