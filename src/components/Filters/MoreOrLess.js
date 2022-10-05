/* eslint complexity: ["error", 6] */

import PropTypes from 'prop-types';
import React from 'react';

export class MoreOrLess extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasMore: props.hasMore };
    this._toggleShowMore = this._toggleShowMore.bind(this);
  }

  _buildListComponent(bucket) {
    const itemProps = this.props.perBucketProps(bucket, {
      ...this.props.listComponentProps,
      item: bucket,
      key: bucket.key,
    });

    return <this.props.listComponent {...itemProps} />;
  }

  _toggleShowMore() {
    this.setState({
      hasMore: !this.state.hasMore,
    });
  }

  render() {
    const all = this.props.options;
    const some = all.length > 5 ? all.slice(0, 5) : all;
    const remain = all.length - 5;

    return (
      <>
        <ul>
          {this.state.hasMore
            ? all.map((bucket) => this._buildListComponent(bucket))
            : some.map((bucket) => this._buildListComponent(bucket))}
        </ul>
        {remain > 0 ? (
          <div>
            <button
              className="a-btn a-btn__link more"
              onClick={this._toggleShowMore}
            >
              {this.state.hasMore
                ? `- Show ${remain} less`
                : `+ Show ${remain} more`}
            </button>
          </div>
        ) : null}
      </>
    );
  }
}

MoreOrLess.propTypes = {
  listComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  listComponentProps: PropTypes.object,
  options: PropTypes.array.isRequired,
  perBucketProps: PropTypes.func,
  hasMore: PropTypes.bool,
};

MoreOrLess.defaultProps = {
  listComponentProps: {},
  perBucketProps: (bucket, props) => props,
  hasMore: false,
};

export default MoreOrLess;

MoreOrLess.propTypes = {
  listComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  listComponentProps: PropTypes.object,
  options: PropTypes.array.isRequired,
  perBucketProps: PropTypes.func,
  hasMore: PropTypes.bool,
};

MoreOrLess.defaultProps = {
  listComponentProps: {},
  perBucketProps: (bucket, props) => props,
  hasMore: false,
};
