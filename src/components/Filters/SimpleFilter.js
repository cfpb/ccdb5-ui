import './Aggregation.less';
import AggregationItem from './AggregationItem';
import { coalesce } from '../../utils';
import CollapsibleFilter from './CollapsibleFilter';
import { connect } from 'react-redux';
import MoreOrLess from './MoreOrLess';
import React from 'react';

export class SimpleFilter extends React.Component {
  render() {
    const listComponentProps = {
      fieldName: this.props.fieldName
    };
    const { desc, fieldName, options, showChildren, title } = this.props;

    return (
      <CollapsibleFilter
        title={title}
        desc={desc}
        showChildren={showChildren}
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

export const mapStateToProps = ( state, ownProps ) => {
  // Find all query filters that refer to the field name
  const activeChildren = coalesce( state.query, ownProps.fieldName, [] );

  return {
    options: coalesce( state.aggs, ownProps.fieldName, [] ),
    showChildren: activeChildren.length > 0
  };
};

export default connect( mapStateToProps )( SimpleFilter );
