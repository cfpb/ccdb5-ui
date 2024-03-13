/* eslint complexity: ["error", 5] */
import { CompanyTypeahead } from '../../Filters/CompanyTypeahead';
import { connect } from 'react-redux';
import { externalTooltipFormatter } from '../../../utils/chart';
import PropTypes from 'prop-types';
import React from 'react';
import { TooltipRow } from './TooltipRow';

const WARN_SERIES_BREAK =
  'CFPB updated product and issue options in April 2017 and August 2023.';

const LEARN_SERIES_BREAK =
  'https://www.consumerfinance.gov/data-research/consumer-complaints/#past-changes';

export class ExternalTooltip extends React.Component {
  render() {
    const { focus, hasTotal, tooltip } = this.props;
    if (tooltip && tooltip.values) {
      return (
        <section className={'tooltip-container u-clearfix ' + focus}>
          {!!this.props.hasCompanyTypeahead && (
            <CompanyTypeahead id="external-tooltip" />
          )}
          <p className="a-micro-copy">
            <span className="heading">{this.props.tooltip.heading}</span>
            <span className="date">{this.props.tooltip.date}</span>
          </p>
          <div>
            <ul className="tooltip-ul">
              {tooltip.values.map((val, key) => (
                <li className={'color__' + val.colorIndex} key={key + '-id'}>
                  <TooltipRow value={val} />
                  <span className="u-right">{val.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>

            {!!hasTotal && (
              <ul className="m-list__unstyled tooltip-ul total">
                <li>
                  <span className="u-left">Total</span>
                  <span className="u-right">
                    {tooltip.total.toLocaleString()}
                  </span>
                </li>
              </ul>
            )}
          </div>
          <p className="a-micro-copy warn">
            {WARN_SERIES_BREAK}{' '}
            <a
              href={LEARN_SERIES_BREAK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn more about Product and
                  Issue changes (opens in new window)"
            >
              Learn More
            </a>
          </p>
        </section>
      );
    }
    return null;
  }
}

export const mapStateToProps = (state) => {
  const { focus, lens, subLens } = state.query;
  const { chartType, tooltip } = state.trends;
  return {
    focus: focus ? 'focus' : '',
    lens,
    subLens,
    hasCompanyTypeahead: lens === 'Company' && !focus,
    hasTotal: chartType === 'area',
    tooltip: externalTooltipFormatter(tooltip),
  };
};

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps)(ExternalTooltip);

ExternalTooltip.propTypes = {
  focus: PropTypes.string,
  lens: PropTypes.string.isRequired,
  hasCompanyTypeahead: PropTypes.bool.isRequired,
  subLens: PropTypes.string,
  hasTotal: PropTypes.bool,
  tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};
