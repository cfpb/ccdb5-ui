import './map-state-navigation.scss';
import { Button } from '@cfpb/design-system-react';
import { useDispatch, useSelector } from 'react-redux';
import { MODE_LIST } from '../../constants';
import { selectFiltersState } from '../../reducers/filters/selectors';
import { tabChanged } from '../../reducers/view/viewSlice';

export const MapStateNavigation = () => {
  const dispatch = useDispatch();
  const stateFilters = useSelector(selectFiltersState) || [];
  const hasFilters = stateFilters.length > 0;

  if (!hasFilters) {
    return null;
  }

  return (
    <section className="map-state-navigation">
      <Button
        label="View complaints based on applied filters"
        isLink
        onClick={() => {
          dispatch(tabChanged(MODE_LIST));
        }}
      />
    </section>
  );
};
