import './ChartWrapper.scss';
import PropTypes from 'prop-types';

export const ChartWrapper = ({ domId, hasKey }) => (
  <section className={`${hasKey ? 'ext-tooltip' : ''}`}>
    <div className="chart-wrapper">
      <p className="y-axis-label">Complaints</p>
      <div id={domId} />
      <p className="x-axis-label">Date received by the CFPB</p>
    </div>
  </section>
);

ChartWrapper.propTypes = {
  domId: PropTypes.string.isRequired,
  hasKey: PropTypes.bool.isRequired,
};
