import React from 'react';
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl';
import './ActionBar.less';

export class ActionBar extends React.Component {
  render() {
    return (
        <summary className="action-bar">
          <div>{ this.props.hits === this.props.total
            ? (<h2>
                 Showing&nbsp;
                 <FormattedNumber value={this.props.total} />
                 &nbsp;total complaints
              </h2>)
            : (<h2>
                Showing&nbsp;
                <FormattedNumber value={this.props.hits} />
                &nbsp;matches out of&nbsp;
                <FormattedNumber value={this.props.total} />
                &nbsp;total complaints</h2>)
          }
          </div>
          <div className="layout-row">
            <div className="cf-select">
              <select id="choose-size">
                <option value="10">Show 10 results</option>
                <option value="25">Show 25 results</option>
                <option value="50">Show 50 results</option>
                <option value="100">Show 100 results</option>
              </select>
            </div>
            <div className="cf-select">
              <select id="choose-sort">
                <option value="relevance_asc">Sort by relevance</option>
                <option value="relevance_desc">Sort by relevance (desc)</option>
                <option value="date_asc">Sort by oldest to newest</option>
                <option value="date_desc">Sort by newest to oldest</option>
              </select>
            </div>

            <h5 className="flex-all"><a>Export results</a></h5>
          </div>
        </summary>
    );
  }
}

export const mapStateToProps = state => {
  return {
    hits: state.results.total,
    total: state.results.doc_count
  }
}

export const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar)