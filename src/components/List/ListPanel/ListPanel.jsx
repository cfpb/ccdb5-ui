import './ListPanel.scss';
import '../../RefineBar/RefineBar.scss';
import { sizeChanged, sortChanged } from '../../../reducers/query/querySlice';
import { sizes, sorts } from '../../../constants';
import { ActionBar } from '../../ActionBar/ActionBar';
import { ComplaintCard } from '../ComplaintCard/ComplaintCard';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBlock } from '../../Warnings/Error';
import { FilterPanel } from '../../Filters/FilterPanel/FilterPanel';
import { FilterPanelToggle } from '../../Filters/FilterPanel/FilterPanelToggle';
import { Loading } from '../../Loading/Loading';
import { NarrativesButtons } from '../../RefineBar/NarrativesButtons';
import { Pagination } from '../Pagination/Pagination';
import { useMemo } from 'react';
import { Select } from '../../RefineBar/Select';
import { sendAnalyticsEvent } from '../../../utils';
import { Separator } from '../../RefineBar/Separator';
import { TabbedNavigation } from '../../TabbedNavigation/TabbedNavigation';
import { selectViewWidth } from '../../../reducers/view/selectors';
import {
  selectQuerySize,
  selectQuerySort,
} from '../../../reducers/query/selectors';
import { useGetList } from '../../../api/hooks/useGetList';

const ERROR = 'ERROR';
const NO_RESULTS = 'NO_RESULTS';
const RESULTS = 'RESULTS';

export const ListPanel = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching, error } = useGetList();
  const size = useSelector(selectQuerySize);
  const sort = useSelector(selectQuerySort);
  const width = useSelector(selectViewWidth);

  const hasMobileFilters = useMemo(() => width < 750, [width]);

  const items = data?.hits || [];

  const onSize = (ev) => {
    const iSize = ev.target.value;
    sendAnalyticsEvent('Dropdown', iSize + ' results');
    dispatch(sizeChanged(iSize));
  };

  const onSort = (ev) => {
    const { value } = ev.target;
    sendAnalyticsEvent('Dropdown', sorts[value]);
    dispatch(sortChanged(value));
  };

  const _determinePhase = () => {
    if (error) {
      return ERROR;
    }
    if (isLoading || isFetching || items.length === 0) {
      return NO_RESULTS;
    }
    if (items.length > 0) {
      return RESULTS;
    }
    return NO_RESULTS;
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
      <Loading isLoading={isLoading || isFetching} />
    </section>
  );
};
