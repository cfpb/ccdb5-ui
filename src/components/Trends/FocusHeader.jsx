import './FocusHeader.less';
import { connect } from 'react-redux';
import iconMap from '../iconMap';
import LensTabs from './LensTabs';
import React from 'react';
import { removeFocus } from '../../actions/trends';

export class FocusHeader extends React.Component {
  render() {
    const { focus, lens, total } = this.props;
    return (
      <div className={'focus-header'}>
        <button
          className={'a-btn a-btn__link clear-focus'}
          id={'clear-focus'}
          onClick={() => {
            this.props.clearFocus(lens);
          }}
        >
          {iconMap.getIcon('left')}
          {'View ' + lens.toLowerCase() + ' trends'}
        </button>
        <div>
          <section className="focus">
            <h1>{focus}</h1>
            <span className={'divider'}></span>
            <h2>{total} Complaints</h2>
          </section>
        </div>
        <LensTabs showTitle={false} key={'lens-tab'} />
      </div>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  clearFocus: () => {
    dispatch(removeFocus());
  },
});

export const mapStateToProps = (state) => ({
  focus: state.query.focus,
  lens: state.query.lens,
  total: state.trends.total.toLocaleString(),
});

export default connect(mapStateToProps, mapDispatchToProps)(FocusHeader);
