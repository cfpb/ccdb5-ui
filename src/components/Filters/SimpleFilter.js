import './Aggregation.less';
import AggregationItem from './AggregationItem';
import { coalesce } from '../../utils';
import CollapsibleFilter from './CollapsibleFilter';
import { connect } from 'react-redux';
import MoreOrLess from './MoreOrLess';
import PropTypes from 'prop-types';
import React from 'react';

export class SimpleFilter extends React.Component {
  render() {
    const listComponentProps = {
      fieldName: this.props.fieldName,
    };
    const { desc, fieldName, options, hasChildren, title } = this.props;

    return (
      <CollapsibleFilter
        title={title}
        desc={desc}
        hasChildren={hasChildren}
        className={'aggregation simple ' + fieldName}
      >
        <MoreOrLess
          listComponent={AggregationItem}
          listComponentProps={listComponentProps}
          options={options}
        />
      </CollapsibleFilter>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  // Find all query filters that refer to the field name
  const activeChildren = coalesce(state.query, ownProps.fieldName, []);

  return {
    options: coalesce(state.aggs, ownProps.fieldName, []),
    hasChildren: activeChildren.length > 0,
  };
};

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps)(SimpleFilter);

SimpleFilter.propTypes = {
  fieldName: PropTypes.string.isRequired,
  desc: PropTypes.string,
  options: PropTypes.array.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};
