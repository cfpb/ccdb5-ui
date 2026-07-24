import { Link as RouterLink } from 'react-router';
import PropTypes from 'prop-types';

/**
 * Adapter for @cfpb/design-system-react DSRProvider.
 * Uses react-router for in-app paths; native anchors for external / hash / mailto.
 *
 * @param {object} props - Link props from DSR
 * @param {string} [props.to] - Destination URL or path
 * @param {import('react').ReactNode} props.children - Link contents
 * @returns {import('react').ReactElement} Anchor or router link
 */
export const DsrLink = ({ to, children, ...rest }) => {
  const isExternal =
    typeof to === 'string' &&
    (/^(https?:|mailto:|tel:)/i.test(to) ||
      to.startsWith('#') ||
      to.startsWith('//'));

  if (!to || isExternal) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={to} {...rest}>
      {children}
    </RouterLink>
  );
};

DsrLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
};
