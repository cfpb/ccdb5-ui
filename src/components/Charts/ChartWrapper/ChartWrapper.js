import './ChartWrapper.less';
import { ErrorBlock } from '../../Warnings/Error';
import PropTypes from 'prop-types';

export const ChartWrapper = ({ domId, hasKey, isEmpty }) => (
  <section className={`${hasKey ? 'ext-tooltip' : ''}`}>
    {isEmpty ? (
      <ErrorBlock text="Cannot display chart. Adjust your date range or date interval" />
    ) : (
      <div className="chart-wrapper">
        <p className="y-axis-label">Complaints</p>
        <div id={domId} />
        <p className="x-axis-label">Date received by the CFPB</p>
      </div>
    )}
  </section>
);

ChartWrapper.propTypes = {
  domId: PropTypes.string.isRequired,
  hasKey: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};
