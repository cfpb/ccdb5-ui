import './ListPanel.less';
import '../../RefineBar/RefineBar.less';
import { changeSize, changeSort } from '../../../reducers/query/query';
import { sizes, sorts } from '../../../constants';
import { ActionBar } from '../../ActionBar/ActionBar';
import { ComplaintCard } from '../ComplaintCard/ComplaintCard';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBlock from '../../Warnings/Error';
import FilterPanel from '../../Filters/FilterPanel';
import FilterPanelToggle from '../../Filters/FilterPanelToggle';
import { Loading } from '../../Loading/Loading';
import { NarrativesButtons } from '../../RefineBar/NarrativesButtons';
import { Pagination } from '../Pagination/Pagination';
import React, { useMemo } from 'react';
import { Select } from '../../RefineBar/Select';
import { sendAnalyticsEvent } from '../../../utils';
import { Separator } from '../../RefineBar/Separator';
import { TabbedNavigation } from '../../TabbedNavigation';
import { selectAggsHasError } from '../../../reducers/aggs/selectors';
import {
  selectResultsActiveCall,
  selectResultsItems,
} from '../../../reducers/results/selectors';
import { selectViewWidth } from '../../../reducers/view/selectors';
import {
  selectQuerySize,
  selectQuerySort,
} from '../../../reducers/query/selectors';

const ERROR = 'ERROR';
const NO_RESULTS = 'NO_RESULTS';
const RESULTS = 'RESULTS';

export const ListPanel = () => {
  const dispatch = useDispatch();
  const hasError = useSelector(selectAggsHasError);
  const size = useSelector(selectQuerySize);
  const sort = useSelector(selectQuerySort);
  const isLoading = useSelector(selectResultsActiveCall);
  const items = useSelector(selectResultsItems);
  const width = useSelector(selectViewWidth);

  const hasMobileFilters = useMemo(() => width < 750, [width]);

  const onSize = (ev) => {
    const iSize = ev.target.value;
    sendAnalyticsEvent('Dropdown', iSize + ' results');
    dispatch(changeSize(iSize));
  };

  const onSort = (ev) => {
    const { value } = ev.target;
    sendAnalyticsEvent('Dropdown', sorts[value]);
    dispatch(changeSort(value));
  };

  const _determinePhase = () => {
    let phase = NO_RESULTS;
    if (hasError) {
      phase = ERROR;
    } else if (items.length > 0) {
      phase = RESULTS;
    }
    return phase;
  };

  const _renderError = () => {
    return <ErrorBlock text="There was a problem executing your search" />;
  };

  const _renderNoResults = () => {
    return <h2>No results were found for your search</h2>;
  };

  const _renderResults = () => {
    return (
      <ul className="cards-panel">
        {items.map((item) => (
          <ComplaintCard key={item.complaint_id} row={item} />
        ))}
      </ul>
    );
  };

  const renderMap = {
    ERROR: _renderError,
    NO_RESULTS: _renderNoResults,
    RESULTS: _renderResults,
  };
  const phase = _determinePhase();

  return (
    <section className="list-panel">
      <ActionBar />
      <TabbedNavigation />
      {!!hasMobileFilters && <FilterPanel />}
      <FilterPanelToggle />
      <div className="layout-row refine-bar">
        <Separator />
        <Select
          label="Select the number of results to display at a time"
          title="Show"
          values={sizes}
          id="size"
          value={size}
          handleChange={onSize}
        />
        <Select
          label="Choose the order in which the results are displayed"
          title="Sort"
          values={sorts}
          id="sort"
          value={sort}
          handleChange={onSort}
        />
        <NarrativesButtons />
      </div>
      {renderMap[phase]()}
      <Pagination />
      <Loading isLoading={!!isLoading || false} />
    </section>
  );
};
