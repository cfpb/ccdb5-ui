import './FocusHeader.scss';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../iconMap';
import { LensTabs } from './LensTabs';
import { focusRemoved } from '../../reducers/trends/trendsSlice';
import {
  selectTrendsFocus,
  selectTrendsLens,
  selectTrendsTotal,
} from '../../reducers/trends/selectors';

export const FocusHeader = () => {
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const total = useSelector(selectTrendsTotal).toLocaleString();

  const dispatch = useDispatch();
  return focus ? (
    <div className="focus-header">
      <button
        className="a-btn a-btn--link clear-focus"
        id="clear-focus"
        onClick={() => {
          dispatch(focusRemoved(lens));
        }}
      >
        {getIcon('left')}
        {'View ' + lens.toLowerCase() + ' trends'}
      </button>
      <div>
        <section className="focus">
          <h1>{focus}</h1>
          <span className="divider" />
          <h2>{total + ' Complaints'}</h2>
        </section>
      </div>

      <LensTabs showTitle={false} key="lens-tab" />
    </div>
  ) : null;
};
