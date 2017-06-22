import React from 'react';
import { connect } from 'react-redux'
import ActionBar from './ActionBar';
import ComplaintCard from './ComplaintCard';
import Pagination from './Pagination';
import './ResultsPanel.less';

export class ResultsPanel extends React.Component {
  render() {
    let composeClasses = 'results-panel';
    if (this.props.className) {
      composeClasses += ' ' + this.props.className;
    }

    return (
        <section className={composeClasses}>
          <ActionBar />
          <ul className="cards-panel">
            {this.props.items
              .map(item => <ComplaintCard key={item.complaint_id}
                                          row={item} />)}
          </ul>
          <Pagination />
        </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.results.items
  }
}

export default connect(mapStateToProps)(ResultsPanel)
