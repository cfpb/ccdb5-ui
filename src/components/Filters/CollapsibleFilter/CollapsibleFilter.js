import './CollapsibleFilter.less';
import getIcon from '../../iconMap';
import PropTypes from 'prop-types';
import { useState } from 'react';

const CollapsibleFilter = ({ className = '', title, desc, children }) => {
  const [isOpen, setOpen] = useState(true);

  const opened = (
    <span className="o-expandable__cue-close" role="img" aria-label="Hide">
      {getIcon('minus-round')}
    </span>
  );
  const closed = (
    <span className="o-expandable__cue-open" role="img" aria-label="Show">
      {getIcon('plus-round')}
    </span>
  );

  return (
    <section className={`o-expandable ${className}`}>
      <button
        className="o-expandable__header"
        aria-expanded={isOpen}
        aria-label={`Hide ${title} filter`}
        onClick={() => setOpen(!isOpen)}
      >
        <h3 className="o-expandable__label">{title}</h3>
        <span className="o-expandable__cues">{isOpen ? opened : closed}</span>
      </button>
      {isOpen ? (
        <div className="o-expandable__content">
          <p>{desc}</p>
          {children}
        </div>
      ) : null}
    </section>
  );
};

CollapsibleFilter.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CollapsibleFilter;
