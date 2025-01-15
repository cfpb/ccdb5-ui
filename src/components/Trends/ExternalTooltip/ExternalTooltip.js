import { CompanyTypeahead } from '../../Filters/Company/CompanyTypeahead';
import { useSelector } from 'react-redux';
import { TooltipRow } from './TooltipRow';
import {
  selectTrendsChartType,
  selectTrendsFocus,
  selectTrendsLens,
  selectTrendsTooltip,
} from '../../../reducers/trends/selectors';
import { externalTooltipFormatter } from '../../../utils/chart';
import { useGetTrends } from '../../../api/hooks/useGetTrends';

const WARN_SERIES_BREAK =
  'CFPB updated product and issue options in April 2017 and August 2023.';

const LEARN_SERIES_BREAK =
  'https://www.consumerfinance.gov/data-research/consumer-complaints/#past-changes';

export const ExternalTooltip = () => {
  const { data } = useGetTrends();
  const colorMap = data?.colorMap;
  const trendsFocus = useSelector(selectTrendsFocus);
  const focus = trendsFocus ? 'focus' : '';
  const lens = useSelector(selectTrendsLens);
  const chartType = useSelector(selectTrendsChartType);
  const tip = useSelector(selectTrendsTooltip);
  const hasCompanyTypeahead = lens === 'Company' && !focus;
  const hasTotal = chartType === 'area';
  const tooltip = externalTooltipFormatter(tip, colorMap);
  if (tooltip && tooltip.values) {
    return (
      <section className="tooltip-container u-clearfix">
        {!!hasCompanyTypeahead && <CompanyTypeahead id="external-tooltip" />}
        <p className="a-micro-copy">
          <span className="heading">{tooltip.heading}</span>
          <span className="date">{tooltip.date}</span>
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
            <ul className="m-list--unstyled tooltip-ul total">
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
};
