import './TourButton.less';
import getIcon from '../iconMap';
import { tourShown } from '../../actions/view';
import { useDispatch } from 'react-redux';

export const TourButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(tourShown())} className="a-btn tour-button">
      {getIcon('help-round')} Take a tour
    </button>
  );
};
