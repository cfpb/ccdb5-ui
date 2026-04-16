import './ChartWrapper.scss';
import PropTypes from 'prop-types';
import { Paragraph } from '@cfpb/design-system-react';

export const ChartWrapper = ({ domId, hasKey }) => (
  <section className={`${hasKey ? 'ext-tooltip' : ''}`}>
    <div className="chart-wrapper">
      <Paragraph className="y-axis-label">Complaints</Paragraph>
      <div id={domId} />
      <Paragraph className="x-axis-label">Date received by the CFPB</Paragraph>
    </div>
  </section>
);

ChartWrapper.propTypes = {
  domId: PropTypes.string.isRequired,
  hasKey: PropTypes.bool.isRequired,
};
