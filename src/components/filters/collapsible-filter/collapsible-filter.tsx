import './collapsible-filter.scss';
import { Icon, Heading } from '@cfpb/design-system-react';
import { useState, type ReactNode } from 'react';

interface CollapsibleFilterProps {
  className?: string;
  title: string;
  desc?: string;
  children: ReactNode;
}

export const CollapsibleFilter = ({
  className = '',
  title,
  desc = '',
  children,
}: CollapsibleFilterProps) => {
  const [isOpen, setOpen] = useState(true);

  const opened = (
    <span className="o-expandable__cue-close" role="img" aria-label="Hide">
      <Icon name="minus-round" isPresentational />
    </span>
  );
  const closed = (
    <span className="o-expandable__cue-open" role="img" aria-label="Show">
      <Icon name="plus-round" isPresentational />
    </span>
  );
  const label = isOpen ? `Collapse ${title} filter` : `Expand ${title} filter`;
  return (
    <section className={`o-expandable ${className}`}>
      <button
        className="o-expandable__header"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setOpen(!isOpen)}
      >
        <Heading type="3" className="o-expandable__label">
          {title}
        </Heading>
        <span className="o-expandable__cues">{isOpen ? opened : closed}</span>
      </button>
      {isOpen ? (
        <div className="o-expandable__content">
          {desc ? <p>{desc}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  );
};
