import AggregationItem from './AggregationItem';
import PropTypes from 'prop-types';
import React from 'react';

// --------------------------------------------------------------------------
// Pure Functions

const mapOfOptions = (options) => {
  const result = options.reduce((map, opt) => {
    map[opt.key] = opt;
    return map;
  }, {});
  return result;
};

const zeroCounts = (cache) => {
  const result = {};
  Object.keys(cache).forEach((key) => {
    result[key] = {
      ...cache[key],
      // eslint-disable-next-line camelcase
      doc_count: 0,
    };
  });

  return result;
};

// --------------------------------------------------------------------------
// Main Class

export default class StickyOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tracked: props.selections.slice(),
      cache: mapOfOptions(props.options),
    };
  }

  componentDidUpdate(prevProps) {
    // Zero out the counts in the cache
    const zeroed = zeroCounts(this.state.cache);
    const nextProps = this.props;

    if (prevProps.options !== nextProps.options) {
      // Update the cache with the new values
      // and zero out the rest
      const cache = Object.assign(zeroed, mapOfOptions(nextProps.options));

      // this.state.tracked is always additive (the options are "sticky")
      const tracked = this.state.tracked.slice();
      nextProps.selections.forEach((selection) => {
        // Add any new selections
        if (tracked.indexOf(selection) === -1) {
          tracked.push(selection);
        }

        // Add missing cache options
        if (!(selection in cache)) {
          cache[selection] = nextProps.onMissingItem(selection);
        }
      });

      this.setState({
        tracked,
        cache,
      });
    }
  }

  render() {
    return (
      <ul>
        {this.state.tracked.map((opt) => {
          const bucket = this.state.cache[opt];
          return bucket ? (
            <AggregationItem
              item={bucket}
              key={bucket.key}
              fieldName={this.props.fieldName}
            />
          ) : null;
        })}
      </ul>
    );
  }
}

StickyOptions.propTypes = {
  fieldName: PropTypes.string.isRequired,
  onMissingItem: PropTypes.func,
  options: PropTypes.array.isRequired,
  selections: PropTypes.array,
};

StickyOptions.defaultProps = {
  onMissingItem: (item) => ({
    key: item,
    // eslint-disable-next-line camelcase
    doc_count: 0,
  }),
  selections: [],
};
