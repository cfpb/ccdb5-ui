import { cloneElement } from 'react';
import ApprovedRound from '../../../icons/approved-round.svg?react';
import AreaChart from '../../../icons/area-chart-custom.svg?react';
import Chart from '../../../icons/chart.svg?react';
import ClockRound from '../../../icons/clock-round.svg?react';
import Copy from '../../../icons/copy.svg?react';
import Down from '../../../icons/down.svg?react';
import Error from '../../../icons/error.svg?react';
import ErrorRound from '../../../icons/error-round.svg';
import ExternalLink from '../../../icons/external-link.svg?react';
import HelpRound from '../../../icons/help-round.svg?react';
import Left from '../../../icons/left.svg?react';
import LineChart from '../../../icons/line-chart-custom.svg?react';
import List from '../../../icons/list.svg?react';
import Map from '../../../icons/map.svg?react';
import MinusRound from '../../../icons/minus-round.svg?react';
import PlusRound from '../../../icons/plus-round.svg?react';
import Printer from '../../../icons/print.svg?react';
import Right from '../../../icons/right.svg?react';
import Search from '../../../icons/search.svg?react';
import Up from '../../../icons/up.svg?react';
import Updating from '../../../icons/updating.svg?react';
import WarningRound from '../../../icons/warning-round.svg?react';

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
