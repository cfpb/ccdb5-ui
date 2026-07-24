import './list-panel.scss';
import '../../refine-bar/refine-bar.scss';
import { sizeChanged, sortChanged } from '../../../reducers/query/query-slice';
import { sizes, sorts } from '../../../constants';
import { ActionBar } from '../../action-bar/action-bar';
import { ComplaintCard } from '../complaint-card/complaint-card';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBlock } from '../../warnings/error';
import { FilterPanel } from '../../filters/filter-panel/filter-panel';
import { FilterPanelToggle } from '../../filters/filter-panel/filter-panel-toggle';
import { Loading } from '../../loading/loading';
import { NarrativesButtons } from '../../refine-bar/narratives-buttons';
import { Pagination } from '../pagination/pagination';
import { useMemo } from 'react';
import { Select } from '../../refine-bar/select';
import { sendAnalyticsEvent } from '../../../utils';
import { Separator } from '../../refine-bar/separator';
import { TabbedNavigation } from '../../tabbed-navigation/tabbed-navigation';
import { selectViewWidth } from '../../../reducers/view/selectors';
import {
  selectQuerySize,
  selectQuerySort,
} from '../../../reducers/query/selectors';
import { useGetList } from '../../../api/hooks/use-get-list';
import { Heading } from '@cfpb/design-system-react';

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
    return <Heading type="2">No results were found for your search</Heading>;
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
