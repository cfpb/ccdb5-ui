import iconMap from '../../iconMap';
import { TooltipWrapper } from '../../Common/TooltipWrapper/TooltipWrapper';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ComplexExample.less';

export const ComplexExample = ({ id, notes, placeholderText, tooltipText }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="o-expandable complex-example">
      <button
        className={`o-expandable_header o-expandable_target o-expandable_target__${
          isOpen ? 'expanded' : 'collapsed'
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        title="Expand content"
      >
        <h3 className="h4 o-expandable_label">
          Additional information and examples
        </h3>
        <span className="o-expandable_link">
          {isOpen ? (
            <span className="o-expandable_cue o-expandable_cue-close">
              <span className="u-visually-hidden-on-mobile">
                {iconMap.getIcon('up')}
              </span>
            </span>
          ) : (
            <span className="o-expandable_cue o-expandable_cue-open">
              <span className="u-visually-hidden-on-mobile">
                {iconMap.getIcon('down')}
              </span>
            </span>
          )}
        </span>
      </button>
      <div
        className={`o-expandable_content o-expandable_content__${
          isOpen ? 'expanded' : 'collapsed u-hidden'
        }`}
      >
        {tooltipText && placeholderText ? (
          <>
            <label className="descriptor">Complex example:</label>
            <label className="u-visually-hidden" htmlFor={`example-${id}`}>
              {tooltipText}
            </label>
            <TooltipWrapper text={tooltipText}>
              <input
                className="a-text-input example-input_full"
                id={`example-${id}`}
                type="text"
                readOnly
                value={placeholderText}
              />
            </TooltipWrapper>
          </>
        ) : null}
        <label className="descriptor">Notes:</label>
        <ul className="m-list">
          {notes.map((note, index) => (
            <li className="m-list_item" key={index}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ComplexExample.propTypes = {
  id: PropTypes.string.isRequired,
  notes: PropTypes.array.isRequired,
  placeholderText: PropTypes.string,
  tooltipText: PropTypes.string,
};
