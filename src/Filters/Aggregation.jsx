import './Aggregation.less'
import AggregationItem from './AggregationItem'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import MoreOrLess from './MoreOrLess'
import React from 'react'

export class Aggregation extends React.Component {
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

export const mapStateToProps = ( state, ownProps ) => ( {
  options: state.aggs[ownProps.fieldName] || []
} )

export default connect( mapStateToProps )( Aggregation )
