import {
  Heading,
  Icon,
  Label,
  List,
  ListItem,
  TextArea,
  TextInput,
} from '@cfpb/design-system-react';
import { TooltipWrapper } from '../../common/tooltip-wrapper/tooltip-wrapper';
import { useState } from 'react';
import PropTypes from 'prop-types';
import './complex-example.scss';

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
        <Heading type="3" className="o-expandable__label">
          Additional information and examples
        </Heading>
        <span className="o-expandable__cues">
          {isOpen ? (
            <span
              className="o-expandable__cue-close"
              role="img"
              aria-label="Hide"
            >
              <span className="u-visually-hidden-on-mobile">
                <Icon name="up" isPresentational />
              </span>
            </span>
          ) : (
            <span
              className="o-expandable__cue-open"
              role="img"
              aria-label="Show"
            >
              <span className="u-visually-hidden-on-mobile">
                <Icon name="down" isPresentational />
              </span>
            </span>
          )}
        </span>
      </button>
      {isOpen ? (
        <div className="o-expandable__content">
          {tooltipText && placeholderText ? (
            <>
              <Label isInline className="descriptor" htmlFor={`example-${id}`}>
                Complex example:
              </Label>
              <span className="u-visually-hidden">{tooltipText}</span>
              <TooltipWrapper text={tooltipText}>
                {placeholderText.length > 30 ? (
                  <TextArea
                    className="example-input"
                    id={`example-${id}`}
                    rows={2}
                    placeholder=""
                    readOnly
                    value={placeholderText}
                  />
                ) : (
                  <TextInput
                    className="example-input"
                    id={`example-${id}`}
                    readOnly
                    value={placeholderText}
                  />
                )}
              </TooltipWrapper>
            </>
          ) : null}
          <Heading type="4" className="descriptor">
            Notes:
          </Heading>
          <List>
            {notes.map((note, index) => (
              <ListItem key={index}>{note}</ListItem>
            ))}
          </List>
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
