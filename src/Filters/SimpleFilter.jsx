import './Aggregation.less'
import AggregationItem from './AggregationItem'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import MoreOrLess from './MoreOrLess'
import React from 'react'

export class SimpleFilter extends React.Component {
  componentWillReceiveProps( nextProps ) {
    this.setState( {
      showChildren: nextProps.showChildren
    } );
  }

  render() {
    const listComponentProps = {
      fieldName: this.props.fieldName
    }

    return (
      <CollapsibleFilter title={this.props.title}
                               desc={this.props.desc}
                               showChildren={this.props.showChildren}
                               className="aggregation">
         <MoreOrLess listComponent={AggregationItem}
                     listComponentProps={listComponentProps}
                     options={this.props.options}
         />
      </CollapsibleFilter>
    )
  }
}

export const mapStateToProps = ( state, ownProps ) => {
  // Find all query filters that refer to the field name
  const activeChildren = state.query[ownProps.fieldName] || []

  return {
    options: state.aggs[ownProps.fieldName] || [],
    showChildren: activeChildren.length > 0
  }
}

export default connect( mapStateToProps )( SimpleFilter )
