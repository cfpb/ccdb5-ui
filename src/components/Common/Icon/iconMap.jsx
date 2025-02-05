import { cloneElement } from 'react';
import { ReactComponent as ApprovedRound } from '../../../icons/approved-round.svg';
import { ReactComponent as AreaChart } from '../../../icons/area-chart-custom.svg';
import { ReactComponent as Chart } from '../../../icons/chart.svg';
import { ReactComponent as ClockRound } from '../../../icons/clock-round.svg';
import { ReactComponent as Copy } from '../../../icons/copy.svg';
import { ReactComponent as Down } from '../../../icons/down.svg';
import { ReactComponent as Error } from '../../../icons/error.svg';
import { ReactComponent as ErrorRound } from '../../../icons/error-round.svg';
import { ReactComponent as ExternalLink } from '../../../icons/external-link.svg';
import { ReactComponent as HelpRound } from '../../../icons/help-round.svg';
import { ReactComponent as Left } from '../../../icons/left.svg';
import { ReactComponent as LineChart } from '../../../icons/line-chart-custom.svg';
import { ReactComponent as List } from '../../../icons/list.svg';
import { ReactComponent as Map } from '../../../icons/map.svg';
import { ReactComponent as MinusRound } from '../../../icons/minus-round.svg';
import { ReactComponent as PlusRound } from '../../../icons/plus-round.svg';
import { ReactComponent as Printer } from '../../../icons/print.svg';
import { ReactComponent as Right } from '../../../icons/right.svg';
import { ReactComponent as Search } from '../../../icons/search.svg';
import { ReactComponent as Up } from '../../../icons/up.svg';
import { ReactComponent as Updating } from '../../../icons/updating.svg';
import { ReactComponent as WarningRound } from '../../../icons/warning-round.svg';

const iconMap = {
  // cf-icon-svg--approved-round
  'approved-round': <ApprovedRound />,
  // cf-icon-svg--approved-round
  'checkmark-round': <ApprovedRound />,
  // cf-icon-svg--clock-round
  'clock-round': <ClockRound />,
  // cf-icon-svg--chart
  chart: <Chart />,
  // cf-icon-svg--copy
  copy: <Copy />,
  // cf-icon-svg--error
  delete: <Error />,
  // cf-icon-svg--error-round
  'delete-round': <ErrorRound />,
  // cf-icon-svg--down
  down: <Down />,
  // cf-icon-svg--error-round
  'error-round': <ErrorRound />,
  'external-link': <ExternalLink />,
  // cf-icon-svg--help-round
  'help-round': <HelpRound />,
  // cf-icon-svg--left
  left: <Left />,
  // cf-icon-svg--list
  list: <List />,
  // cf-icon-svg--map
  map: <Map />,
  // cf-icon-svg--minus-round
  'minus-round': <MinusRound />,
  // cf-icon-svg--plus-round
  'plus-round': <PlusRound />,
  // cf-icon-svg--print
  printer: <Printer />,
  // cf-icon-svg--right
  right: <Right />,
  // cf-icon-svg--search
  search: <Search />,
  // cf-icon-svg--updating
  updating: <Updating />,
  // cf-icon-svg--up
  up: <Up />,
  // cf-icon-svg--warning-round
  'warning-round': <WarningRound />,
  // Non-CFPB standard icon
  'line-chart': <LineChart />,
  // Non-CFPB standard icon
  'area-chart': <AreaChart />,
};

/**
 * Retrieve an SVG icon given it's name.
 *
 * @param {string} name - A cf-icon SVG canonical icon name.
 * @param {string} [customClass] - A custom CSS class name to add to an icon.
 * @returns {object} An SVG icon markup.
 */
function getIcon(name, customClass) {
  if (!Object.hasOwn(iconMap, name)) {
    // eslint-disable-next-line no-console
    console.error(`No icon with the name ${name}.`);
    return false;
  }

  let Icon = iconMap[name];

  if (typeof customClass !== 'undefined') {
    Icon = cloneElement(Icon, {
      className: `cf-icon-svg ${customClass}`,
    });
  }

  return Icon;
}

export default getIcon;
