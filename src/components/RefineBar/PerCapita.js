import { GEO_NORM_NONE, GEO_NORM_PER1000 } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { dataNormalizationChanged } from '../../actions/map';
import React, { useMemo } from 'react';
import {
  selectQueryDataNormalization,
  selectQueryEnablePer1000,
} from '../../reducers/query/selectors';
import { selectedClass } from '../../utils';

export const PerCapita = () => {
  const dataNormalization = useSelector(selectQueryDataNormalization);
  const enablePer1000 = useSelector(selectQueryEnablePer1000);
  const dispatch = useDispatch();

  const perCapButtonClass = useMemo(() => {
    if (enablePer1000) {
      return selectedClass(dataNormalization, GEO_NORM_PER1000);
    }
    return 'a-btn__disabled';
  }, [dataNormalization, enablePer1000]);

  return (
    <section className="m-btn-group">
      <p>Map shading</p>
      <button
        aria-label="Display map by complaints"
        className={'a-btn' + selectedClass(dataNormalization, GEO_NORM_NONE)}
        onClick={() => {
          dispatch(dataNormalizationChanged(GEO_NORM_NONE));
        }}
        disabled={dataNormalization === GEO_NORM_NONE}
      >
        Complaints
      </button>
      <button
        aria-label="Display map by complaints per 1,000 people"
        className={'a-btn ' + perCapButtonClass}
        disabled={dataNormalization === GEO_NORM_PER1000}
        onClick={() => {
          dispatch(dataNormalizationChanged(GEO_NORM_PER1000));
        }}
      >
        Complaints per 1,000 <span>population</span>
      </button>
    </section>
  );
};
