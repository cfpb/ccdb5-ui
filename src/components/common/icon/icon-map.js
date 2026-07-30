import { cloneElement } from 'react';
import AreaChart from '../../../icons/area-chart-custom.svg?react';
import LineChart from '../../../icons/line-chart-custom.svg?react';

/**
 * Custom icons unique only to CCDB / Complaint Explorer
 */
const iconMap = {
  'line-chart': <LineChart />,
  'area-chart': <AreaChart />,
};

/**
 * Retrieve an SVG icon for custom (repo-only) icon names.
 *
 * @param {string} name - Custom icon name (line-chart, area-chart).
 * @param {string} [customClass] - Optional CSS class to add to the icon.
 * @returns {object|false} SVG element or false if name not found.
 */
function getIcon(name, customClass = '') {
  if (!Object.hasOwn(iconMap, name)) {
    // eslint-disable-next-line no-console
    console.error(`No icon with the name ${name}.`);
    return false;
  }

  const Icon = iconMap[name];
  return cloneElement(Icon, {
    className: `cf-icon-svg ${customClass}`.trim(),
  });
}

export default getIcon;
