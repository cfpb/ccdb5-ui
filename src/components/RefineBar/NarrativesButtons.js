import { addFilter, removeFilter } from '../../reducers/query/query';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { selectedClass } from '../../utils';
import { selectQueryHasNarrative } from '../../reducers/query/selectors';

const FIELD_NAME = 'has_narrative';

export const NarrativesButtons = () => {
  const isChecked = useSelector(selectQueryHasNarrative);
  const dispatch = useDispatch();

  return (
    <section className="m-btn-group">
      <p>Read</p>
      <button
        aria-label="Show only complaints with narratives"
        id="btn-add-narratives"
        className={'a-btn' + selectedClass(true, isChecked)}
        disabled={isChecked}
        onClick={() => {
          dispatch(addFilter(FIELD_NAME, ''));
        }}
      >
        Only complaints with narratives
      </button>

      <button
        aria-label="Show all complaints"
        id="btn-remove-narratives"
        className={'a-btn' + selectedClass(false, !!isChecked)}
        disabled={!isChecked}
        onClick={() => {
          dispatch(removeFilter(FIELD_NAME, ''));
        }}
      >
        All complaints
      </button>
    </section>
  );
};
