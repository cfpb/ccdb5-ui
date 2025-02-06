import { GEO_NORM_NONE, GEO_NORM_PER1000 } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { dataNormalizationUpdated } from '../../reducers/filters/filtersSlice';
import { useMemo } from 'react';
import {
  selectFiltersDataNormalization,
  selectFiltersEnablePer1000,
} from '../../reducers/filters/selectors';
import { selectedClass } from '../../utils';

export const PerCapita = () => {
  const dataNormalization = useSelector(selectFiltersDataNormalization);
  const enablePer1000 = useSelector(selectFiltersEnablePer1000);
  const dispatch = useDispatch();

  const perCapButtonClass = useMemo(() => {
    if (enablePer1000) {
      return selectedClass(dataNormalization, GEO_NORM_PER1000);
    }
    return 'a-btn__disabled';
  }, [dataNormalization, enablePer1000]);

  return (
    <section className="per-capita">
      <p>Map shading</p>
      <div className="m-btn-group">
        <button
          aria-label="Display map by complaints"
          className={'a-btn' + selectedClass(dataNormalization, GEO_NORM_NONE)}
          onClick={() => {
            dispatch(dataNormalizationUpdated(GEO_NORM_NONE));
          }}
          disabled={dataNormalization === GEO_NORM_NONE}
        >
          Complaints
        </button>
        <button
          aria-label="Display map by complaints per 1,000 people"
          className={'a-btn ' + perCapButtonClass}
          disabled={dataNormalization === GEO_NORM_PER1000 || !enablePer1000}
          onClick={() => {
            dispatch(dataNormalizationUpdated(GEO_NORM_PER1000));
          }}
        >
          Complaints per 1,000 <span>population</span>
        </button>
      </div>
    </section>
  );
};
