import './filter-panel-toggle.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Heading, Icon } from '@cfpb/design-system-react';
import { updateFilterVisibility } from '../../../reducers/view/view-slice';
import { selectViewHasFilters } from '../../../reducers/view/selectors';

export const FilterPanelToggle = () => {
  const dispatch = useDispatch();
  const hasFilters = useSelector(selectViewHasFilters);
  const openClass = hasFilters ? ' filter-panel-toggle--open' : '';

  return (
    <section className={'filter-panel-toggle' + openClass}>
      <button
        type="button"
        className="filter-panel-toggle__header"
        aria-expanded={hasFilters}
        onClick={() => {
          dispatch(updateFilterVisibility());
        }}
      >
        <Heading type="3" className="filter-panel-toggle__label">
          Filter results
        </Heading>
        <span className="filter-panel-toggle__cue" aria-hidden="true">
          <Icon name={hasFilters ? 'up' : 'down'} isPresentational />
        </span>
      </button>
    </section>
  );
};
