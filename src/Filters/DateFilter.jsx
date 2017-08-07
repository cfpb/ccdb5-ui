import './DateFilter.less'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

export class DateFilter extends React.Component {
  render() {
    return (
      <CollapsibleFilter title="Date CFPB Received the complaint"
                         className="aggregation date-filter">
          <div className="layout-row">
              <div className="flex-all">
                  <label className="a-label a-label__heading">From:</label>
                  <input type="date" />
              </div>
              <div className="flex-all">
                  <label className="a-label a-label__heading">Through:</label>
                  <input type="date" />
              </div>
          </div>
      </CollapsibleFilter>
    )
  }
}

// ----------------------------------------------------------------------------
// Meta

DateFilter.propTypes = {
  fieldName: PropTypes.string.isRequired
}

DateFilter.defaultProps = {
}

export const mapStateToProps = state => ( {
} )

export const mapDispatchToProps = dispatch => ( {
  // onFoo: () => {
  //   dispatch( foo() )
  // }
} )

export default connect( mapStateToProps, mapDispatchToProps )( DateFilter )
