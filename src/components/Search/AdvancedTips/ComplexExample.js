import getIcon from '../../iconMap';
import { TooltipWrapper } from '../../Common/TooltipWrapper/TooltipWrapper';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ComplexExample.less';

export const ComplexExample = ({ id, notes, placeholderText, tooltipText }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="o-expandable complex-example">
      <button
        className="o-expandable_header"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        title="Expand content"
      >
        <h3 className="h4 o-expandable_label">
          Additional information and examples
        </h3>
        <span className="o-expandable_cues">
          {isOpen ? (
            <span
              className="o-expandable_cue-close"
              role="img"
              aria-label="Hide"
            >
              <span className="u-visually-hidden-on-mobile">
                {getIcon('up')}
              </span>
            </span>
          ) : (
            <span
              className="o-expandable_cue-open"
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
        <div className="o-expandable_content">
          {tooltipText && placeholderText ? (
            <>
              <label className="descriptor" htmlFor={`example-${id}`}>
                Complex example:
              </label>
              <span className="u-visually-hidden">{tooltipText}</span>
              <TooltipWrapper text={tooltipText}>
                {placeholderText.length > 30 ? (
                  <textarea
                    className="a-text-input example-input_full"
                    id={`example-${id}`}
                    rows={2}
                    readOnly
                    value={placeholderText}
                  />
                ) : (
                  <input
                    className="a-text-input example-input_full"
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
              <li className="m-list_item" key={index}>
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
