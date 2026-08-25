import { filterPatch, SLUG_SEPARATOR, THESE_UNITED_STATES } from '../constants';
import { slugify } from '../utils';

interface AggBucket {
  key: string;
  [key: string]: unknown;
}

interface Agg {
  key: string;
  [key: string]: unknown;
}

export const formatPillPrefix = (fieldName: string): string => {
  // update this if they want the pill prefixes in other fields.
  if (fieldName === 'timely') {
    const rep = /_/g;
    const prefix = fieldName.replaceAll(rep, ' ');
    return prefix[0].toUpperCase() + prefix.slice(1) + ': ';
  }
  return '';
};

export const formatStateLabel = (abbr: string): string => {
  const stateName = THESE_UNITED_STATES[abbr];
  return stateName ? `${stateName} (${abbr})` : abbr;
};

export const getUpdatedFilters = (
  filterName: string,
  filters: string[],
  aggs: Agg[],
  fieldName: string,
  normalizedSiblings?: AggBucket[],
): string[] => {
  // early exit if its not issue or product
  if (!filterPatch.includes(fieldName as (typeof filterPatch)[number])) {
    return filters;
  }

  // remove parent filter
  const parts = filterName.split(SLUG_SEPARATOR);
  const parentFilter = parts[0];
  const hasParent = filters.includes(parentFilter);
  // remove current filter
  const oldFilters = filters
    .filter((filter) => filter !== parentFilter && filterName)
    .filter((filter) => filter !== filterName);
  // apply siblings
  const sibs: string[] = [];
  const parentAggregation = aggs.find((agg) => agg.key === parentFilter);
  if (hasParent) {
    const subAgg = parentAggregation?.['sub_' + fieldName + '.raw'] as
      { buckets: AggBucket[] } | undefined;
    const buckets = normalizedSiblings ?? subAgg?.buckets ?? [];
    for (const bucket of buckets) {
      // don't include self
      const childKey = bucket.key.includes(SLUG_SEPARATOR)
        ? bucket.key.split(SLUG_SEPARATOR)[1]
        : bucket.key;
      if (childKey !== parts[1]) {
        sibs.push(slugify(parentFilter, childKey));
      }
    }
  }

  return [...oldFilters, ...sibs];
};
