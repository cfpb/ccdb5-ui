import { MODE_TRENDS, SLUG_SEPARATOR } from '../../constants';
import AggregationBranch from './AggregationBranch';
import CollapsibleFilter from './CollapsibleFilter/CollapsibleFilter';
import { useSelector } from 'react-redux';
import { sortSelThenCount } from '../../utils';
import MoreOrLess from './MoreOrLess/MoreOrLess';
import React from 'react';
import {
  selectQueryFocus,
  selectQueryLens,
  selectQueryProduct,
  selectQueryTab,
} from '../../reducers/query/selectors';
import { selectAggsProduct } from '../../reducers/aggs/selectors';

/**
 * Helper function generate and sort options
 *
 * @param {Array} aggsProducts - Products array from aggs reducer
 * @param {Array} queryProduct - Products array from query reducer. TBD this will move to new filters reducer in the future
 * @param {string} focus - If a current focus is selected
 * @param {string} lens - Name of the Aggregate By on Trends tab
 * @param {string} tab - Current tab we are on
 * @returns {Array} Options for the product filter
 */
export const generateOptions = (
  aggsProducts,
  queryProduct,
  focus,
  lens,
  tab,
) => {
  const selections = [];
  const allProducts = queryProduct ? queryProduct : [];
  // Reduce the products to the parent keys (and dedup)
  allProducts.forEach((prod) => {
    const idx = prod.indexOf(SLUG_SEPARATOR);
    const key = idx === -1 ? prod : prod.substring(0, idx);
    if (selections.indexOf(key) === -1) {
      selections.push(key);
    }
  });

  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(aggsProducts, selections);
  if (focus) {
    const isProductFocus = tab === MODE_TRENDS && lens === 'Product';
    options.forEach((opt) => {
      opt.isDisabled = isProductFocus ? opt.key !== focus : false;
      opt['sub_product.raw'].buckets.forEach((bucket) => {
        bucket.isDisabled = isProductFocus ? opt.isDisabled : false;
      });
    });
  }

  return options;
};

export const Product = () => {
  // See if there are an active product filters
  const focus = useSelector(selectQueryFocus);
  const lens = useSelector(selectQueryLens);
  const tab = useSelector(selectQueryTab);
  const queryProduct = useSelector(selectQueryProduct);
  const aggsProducts = useSelector(selectAggsProduct);

  const options = generateOptions(aggsProducts, queryProduct, focus, lens, tab);

  const desc =
    'The type of product and sub-product the consumer identified in the ' +
    'complaint';

  const listComponentProps = {
    fieldName: 'product',
  };

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers
  const _onBucket = (bucket, props) => {
    props.subitems = bucket['sub_product.raw'].buckets;
    return props;
  };

  return (
    <CollapsibleFilter
      title="Product / sub-product"
      desc={desc}
      hasChildren={true}
      className="aggregation product"
    >
      <MoreOrLess
        listComponent={AggregationBranch}
        listComponentProps={listComponentProps}
        options={options}
        perBucketProps={_onBucket}
      />
    </CollapsibleFilter>
  );
};
