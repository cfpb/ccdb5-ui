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
          <div>Page | Sort | Export</div>
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