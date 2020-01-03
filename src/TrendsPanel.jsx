import './TrendsPanel.less'
import ActionBar from './ActionBar'
import { connect } from 'react-redux'
import DateIntervals from './DateIntervals';
import LineChart from './LineChart';
import Loading from './Dialogs/Loading'
import React from 'react'
import RowChart from './RowChart';

export class TrendsPanel extends React.Component {
  render() {
    return (
        <section className="trends-panel">
          <ActionBar />
          <DateIntervals />
          <LineChart />
          <RowChart aggtype="product" />
          <RowChart aggtype="issue" />
          <Loading isLoading={this.props.isLoading || false} />
        </section>
    )
  }
}

const mapStateToProps = state => ( {
  isLoading: state.results.isLoading,
  items: state.results.items
} )

export default connect( mapStateToProps )( TrendsPanel )
