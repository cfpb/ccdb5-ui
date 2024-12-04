import getIcon from '../../Common/Icon/iconMap';
import { TooltipWrapper } from '../../Common/TooltipWrapper/TooltipWrapper';
import { useState } from 'react';
import PropTypes from 'prop-types';
import './ComplexExample.scss';

export const ComplexExample = ({ id, notes, placeholderText, tooltipText }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="o-expandable complex-example">
      <button
        className="o-expandable__header"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        title="Expand content"
      >
        <h3 className="o-expandable__label">
          Additional information and examples
        </h3>
        <span className="o-expandable__cues">
          {isOpen ? (
            <span
              className="o-expandable__cue-close"
              role="img"
              aria-label="Hide"
            >
              <span className="u-visually-hidden-on-mobile">
                {getIcon('up')}
              </span>
            </span>
          ) : (
            <span
              className="o-expandable__cue-open"
              role="img"
              aria-label="Show"
            >
              <span className="u-visually-hidden-on-mobile">
                {getIcon('down')}
              </span>
            </span>
          )}
        </span>
      </button>
      {isOpen ? (
        <div className="o-expandable__content">
          {tooltipText && placeholderText ? (
            <>
              <label className="descriptor" htmlFor={`example-${id}`}>
                Complex example:
              </label>
              <span className="u-visually-hidden">{tooltipText}</span>
              <TooltipWrapper text={tooltipText}>
                {placeholderText.length > 30 ? (
                  <textarea
                    className="a-text-input example-input"
                    id={`example-${id}`}
                    rows={2}
                    readOnly
                    value={placeholderText}
                  />
                ) : (
                  <input
                    className="a-text-input example-input"
                    id={`example-${id}`}
                    rows={2}
                    readOnly
                    value={placeholderText}
                  />
                )}
              </TooltipWrapper>
            </>
          ) : null}
          <h4 className="descriptor">Notes:</h4>
          <ul className="m-list">
            {notes.map((note, index) => (
              <li className="m-list__item" key={index}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

ComplexExample.propTypes = {
  id: PropTypes.string.isRequired,
  notes: PropTypes.array.isRequired,
  placeholderText: PropTypes.string,
  tooltipText: PropTypes.string,
};
