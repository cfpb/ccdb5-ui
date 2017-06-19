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

    let to = this.props.from + this.props.size;

    return (
        <section className={composeClasses}>
          <ActionBar />
          <ul className="cards-panel">
            {this.props.items
              .filter((e, i) => i >= this.props.from && i < to)
              .map(item => <ComplaintCard key={item.complaint_id}
                                          row={item} />)}
          </ul>
          <Pagination {...this.props} />
        </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    from: state.query.from,
    size: state.query.size,
    items: state.results.items,
    total: state.results.total
  }
}

export default connect(mapStateToProps)(ResultsPanel)
