import { filterPatch, SLUG_SEPARATOR } from '../constants';
import { slugify } from '../utils';

export const formatPillPrefix = (fieldName) => {
  // update this if they want the pill prefixes in other fields.
  if (fieldName === 'timely') {
    const rep = /_/g;
    const prefix = fieldName.replace(rep, ' ');
    return prefix[0].toUpperCase() + prefix.slice(1) + ': ';
  }
  return '';
};

export const getUpdatedFilters = (filterName, filters, aggs, fieldName) => {
  // early exit if its not issue or product
  if (!filterPatch.includes(fieldName)) {
    return filters;
  }

  // remove parent filter
  const parts = filterName.split(SLUG_SEPARATOR);
  const parentFilter = parts[0];
  const hasParent = filters.includes(parentFilter);
  // remove current filter
  const oldFilters = filters
    .filter((o) => o !== parentFilter && filterName)
    .filter((o) => o !== filterName);
  // apply siblings
  const sibs = [];
  if (hasParent) {
    const siblings = aggs.find((o) => o.key === parentFilter);
    siblings['sub_' + fieldName + '.raw'].buckets.forEach((o) => {
      // don't include self
      if (o.key !== parts[1]) {
        sibs.push(slugify(parentFilter, o.key));
      }
    });
  }

  return oldFilters.concat(sibs);
};
