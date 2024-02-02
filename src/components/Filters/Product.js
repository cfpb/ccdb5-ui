import { coalesce, sortSelThenCount } from '../../utils';
import { MODE_TRENDS, SLUG_SEPARATOR } from '../../constants';
import AggregationBranch from './AggregationBranch';
import CollapsibleFilter from './CollapsibleFilter';
import { connect } from 'react-redux';
import MoreOrLess from './MoreOrLess';
import PropTypes from 'prop-types';
import React from 'react';

export class Product extends React.Component {
  constructor(props) {
    super(props);

    this._onBucket = this._onBucket.bind(this);
  }

  render() {
    const desc =
      'The type of product and sub-product the consumer ' +
      'identified in the complaint';

    const listComponentProps = {
      fieldName: 'product',
    };

    return (
      <CollapsibleFilter
        title="Product / sub-product"
        desc={desc}
        hasChildren={this.props.hasChildren}
        className="aggregation product"
      >
        <MoreOrLess
          listComponent={AggregationBranch}
          listComponentProps={listComponentProps}
          options={this.props.options}
          perBucketProps={this._onBucket}
        />
      </CollapsibleFilter>
    );
  }

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers

  _onBucket(bucket, props) {
    props.subitems = bucket['sub_product.raw'].buckets;
    return props;
  }
}

export const mapStateToProps = (state) => {
  // See if there are an active product filters
  const { focus, lens, tab } = state.query;
  const allProducts = coalesce(state.query, 'product', []);
  const selections = [];

  // Reduce the products to the parent keys (and dedup)
  allProducts.forEach((prod) => {
    const idx = prod.indexOf(SLUG_SEPARATOR);
    const key = idx === -1 ? prod : prod.substr(0, idx);
    if (selections.indexOf(key) === -1) {
      selections.push(key);
    }
  });

  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(state.aggs.product, selections);
  if (focus) {
    const isProductFocus = tab === MODE_TRENDS && lens === 'Product';
    options.forEach((opt) => {
      opt.disabled = isProductFocus ? opt.key !== focus : false;
      opt['sub_product.raw'].buckets.forEach((bucket) => {
        bucket.disabled = isProductFocus ? opt.disabled : false;
      });
    });
  }

  return {
    options,
  };
};

export default connect(mapStateToProps)(Product);

Product.propTypes = {
  hasChildren: PropTypes.bool,
  options: PropTypes.array.isRequired,
};
