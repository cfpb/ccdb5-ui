import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Heading } from '@cfpb/design-system-react';
import { filterPatch, SLUG_SEPARATOR } from '../../../../constants';
import { coalesce, sanitizeHtmlId } from '../../../../utils';
import {
  filtersReplaced,
  filterToggled,
} from '../../../../reducers/filters/filters-slice';
import { getUpdatedFilters } from '../../../../utils/filters';
import { selectFiltersRoot } from '../../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../../api/hooks/use-get-aggregations';

const appliedFilters = ({ item, siblings, filters, isActive }) => {
  const [parentFilter] = item.key.split(SLUG_SEPARATOR);
  const parentKey = parentFilter + SLUG_SEPARATOR;
  const activeChildren = new Set(
    filters.filter((filter) => filter.startsWith(parentKey)),
  );
  const selectingFinalChild =
    !isActive &&
    siblings.length > 0 &&
    siblings
      .filter((sibling) => sibling.key !== item.key)
      .every((sibling) => activeChildren.has(sibling.key));

  if (selectingFinalChild) {
    return [
      ...filters.filter(
        (filter) => filter !== parentFilter && !filter.startsWith(parentKey),
      ),
      parentFilter,
    ];
  }

  return [...filters, item.key];
};

export const AggregationItem = ({ fieldName, item, siblings = [] }) => {
  const { data: aggsState, isSuccess, error } = useGetAggregations();
  const filtersState = useSelector(selectFiltersRoot);
  const dispatch = useDispatch();
  const aggs = coalesce(aggsState, fieldName, []);

  if (!isSuccess || !aggs || error) {
    return null;
  }

  const filters = coalesce(filtersState, fieldName, []);

  const isActive =
    filters.includes(item.key) ||
    filters.includes(item.key.split(SLUG_SEPARATOR)[0]);

  const value = item.value || item.key;
  const id = sanitizeHtmlId(fieldName + '-' + item.key);

  const addFilter = () => {
    const isChildItem = item.key.includes(SLUG_SEPARATOR);
    // cases where its issue / product
    if (isChildItem && filterPatch.includes(fieldName)) {
      const parentFilter = item.key.split(SLUG_SEPARATOR)[0];
      const rawSiblings =
        aggs.find((agg) => agg.key === parentFilter)?.[
          'sub_' + fieldName + '.raw'
        ]?.buckets ?? [];
      const normalizedSiblings =
        siblings.length > 0
          ? siblings
          : rawSiblings.map((sibling) => ({
              ...sibling,
              key: `${parentFilter}${SLUG_SEPARATOR}${sibling.key}`,
            }));
      const filtersToApply = appliedFilters({
        item,
        siblings: normalizedSiblings,
        filters,
        isActive,
      });
      dispatch(filtersReplaced(fieldName, filtersToApply));
    } else {
      dispatch(filterToggled(fieldName, item));
    }
  };

  const removeFilter = () => {
    if (filterPatch.includes(fieldName)) {
      const filterName = item.key;
      const updatedFilters = getUpdatedFilters(
        filterName,
        filters,
        aggs,
        fieldName,
        siblings,
      );
      dispatch(filtersReplaced(fieldName, updatedFilters));
    } else {
      dispatch(filterToggled(fieldName, item));
    }
  };

  const onChange = () => {
    if (isActive) {
      removeFilter();
    } else {
      addFilter();
    }
  };

  return (
    <li className="aggregation-item layout-row">
      <Checkbox
        id={id}
        label={value}
        labelClassName="bucket-key"
        className="aggregation-item__checkbox"
        disabled={item.isDisabled}
        checked={isActive}
        onChange={onChange}
      />
      <Heading type="5" className="flex-fixed bucket-count">
        {item.doc_count.toLocaleString()}
      </Heading>
    </li>
  );
};

AggregationItem.propTypes = {
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape({
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  }).isRequired,
  siblings: PropTypes.array,
};
