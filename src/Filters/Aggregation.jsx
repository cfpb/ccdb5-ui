import React from 'react';
import { connect } from 'react-redux';
import CollapsibleFilter from './CollapsibleFilter';
import AggregationItem from './AggregationItem';
import './Aggregation.less';

export class Aggregation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showMore: this.props.showMore || false }
    this._toggleShowMore = this._toggleShowMore.bind(this);
  }

  _toggleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  render() {
    const all = this.props.options || [];
    const some = all.length > 6 ? all.slice(0, 5) : all
    const remain = all.length - 6

    return (
        <CollapsibleFilter title={this.props.title}
                           desc={this.props.desc}
                           showChildren={this.props.showChildren}
                           className="aggregation">
            <ul>
            {!this.state.showMore ?
              some.map(bucket =>
                <AggregationItem item={bucket} key={ bucket.key } fieldName={ this.props.fieldName } />
            ) :
              all.map(bucket =>
                <AggregationItem item={bucket} key={ bucket.key } fieldName={ this.props.fieldName } />
            )}
            </ul>
            {remain > 0 && !this.state.showMore ? (
              <div className="flex-fixed">
                   <button className="a-btn a-btn__link hover more" onClick={ this._toggleShowMore }>+ Show {remain} more</button>
              </div>
            ) : null}
            {remain > 0 && this.state.showMore ? (
              <div className="flex-fixed">
                   <button className="a-btn a-btn__link hover more" onClick={ this._toggleShowMore }>- Show {remain} less </button>
              </div>
            ) : null}
        </CollapsibleFilter>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  return {
    options: state.aggs[ownProps.fieldName]
  }
};

export default connect(mapStateToProps)(Aggregation);
