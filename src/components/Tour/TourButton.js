import './TourButton.scss';
import getIcon from '../iconMap';
import { useDispatch } from 'react-redux';
import { tourShown } from '../../reducers/view/viewSlice';

export const TourButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(tourShown())} className="a-btn tour-button">
      {getIcon('help-round')} Take a tour
    </button>
  );
};
