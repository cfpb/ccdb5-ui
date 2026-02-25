import './TourButton.scss';
import { Button } from '@cfpb/design-system-react';
import { useDispatch } from 'react-redux';
import { tourShown } from '../../reducers/view/viewSlice';

export const TourButton = () => {
  const dispatch = useDispatch();

  return (
    <Button
      label="Take a tour"
      iconLeft="help-round"
      className="tour-button"
      onClick={() => dispatch(tourShown())}
    />
  );
};
