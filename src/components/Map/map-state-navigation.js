import './map-state-navigation.scss';
import { Button } from '@cfpb/design-system-react';
import { useDispatch } from 'react-redux';
import { MODE_LIST } from '../../constants';
import { tabChanged } from '../../reducers/view/viewSlice';

export const MapStateNavigation = () => {
  const dispatch = useDispatch();

  return (
    <div className="map-state-navigation">
      <Button
        label="View list of complaints based on applied filters"
        isLink
        onClick={() => {
          dispatch(tabChanged(MODE_LIST));
        }}
      />
    </div>
  );
};
