import React from 'react'
import { connect } from 'react-redux'
import AggregationItem from './AggregationItem'
import CollapsibleFilter from './CollapsibleFilter'
import MoreOrLess from './MoreOrLess'
import './Aggregation.less'

export class Aggregation extends React.Component {
  render() {
    const listComponentProps = {
      fieldName: this.props.fieldName
    }

    return (
      <CollapsibleFilter title={this.props.title}
                         desc={this.props.desc}
                         showChildren={this.props.showChildren}
                         className='aggregation'>
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
