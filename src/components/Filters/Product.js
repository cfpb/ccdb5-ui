import { coalesce, sortSelThenCount } from '../../utils';
import { MODE_TRENDS, SLUG_SEPARATOR } from '../../constants';
import AggregationBranch from './AggregationBranch';
import CollapsibleFilter from './CollapsibleFilter';
import { useSelector } from 'react-redux';
import MoreOrLess from './MoreOrLess';
import PropTypes from 'prop-types';
import React from 'react';
import {
  selectQueryFocus,
  selectQueryLens,
  selectQueryState,
  selectQueryTab,
} from '../../reducers/query/selectors';
import { selectAggsProduct } from '../../reducers/aggs/selectors';

export const Product = ({ hasChildren }) => {
  const query = useSelector(selectQueryState);
  const focus = useSelector(selectQueryFocus);
  const lens = useSelector(selectQueryLens);
  const tab = useSelector(selectQueryTab);
  const product = useSelector(selectAggsProduct);

  const allProducts = coalesce(query, 'product', []);
  const selections = [];
  allProducts.forEach((prod) => {
    const idx = prod.indexOf(SLUG_SEPARATOR);
    const key = idx === -1 ? prod : prod.substr(0, idx);
    if (selections.indexOf(key) === -1) {
      selections.push(key);
    }
  });

  const options = sortSelThenCount(product, selections);
  if (focus) {
    const isProductFocus = tab === MODE_TRENDS && lens === 'Product';
    options.forEach((opt) => {
      opt.disabled = isProductFocus ? opt.key !== focus : false;
      opt['sub_product.raw'].buckets.forEach((bucket) => {
        bucket.disabled = isProductFocus ? opt.disabled : false;
      });
    });
  }

  const desc =
    'The type of product and sub-product the consumer ' +
    'identified in the complaint';

  const listComponentProps = {
    fieldName: 'product',
  };

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers

  const _onBucket = (bucket) => {
    return bucket['sub_product.raw'].buckets;
  };

  return (
    <CollapsibleFilter
      title="Product / sub-product"
      desc={desc}
      hasChildren={hasChildren}
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

Product.propTypes = {
  hasChildren: PropTypes.bool,
};
