import { GEO_NORM_NONE, GEO_NORM_PER1000 } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { dataNormalizationChanged } from '../../actions/map';
import React from 'react';


export const PerCapita = () => {
  const dataNormalization = useSelector(
    state => state.query.dataNormalization || GEO_NORM_NONE );
  const enablePer1000 = useSelector(
    state => state.query.enablePer1000 || false );
  const dispatch = useDispatch();

  const _setNormalization = val => {
    if ( dataNormalization !== val ) {
      dispatch( dataNormalizationChanged( val ) );
    }
  };

  const _getRawButtonClass = () => {
    if ( dataNormalization === GEO_NORM_NONE ) {
      return 'selected';
    }
    return 'deselected';
  };

  const _getPerCapButtonClass = () => {
    if ( enablePer1000 ) {
      return dataNormalization === GEO_NORM_PER1000 ? 'selected' : 'deselected';
    }
    return 'a-btn__disabled';
  };

  return (
    <section className='m-btn-group'>
      <p>Map shading</p>
      <button
        className={ 'a-btn toggle-button raw ' + _getRawButtonClass() }
        onClick={ () => _setNormalization( GEO_NORM_NONE ) }>
        Complaints
      </button>
      <button
        className={ 'a-btn toggle-button capita ' + _getPerCapButtonClass() }
        onClick={ () => enablePer1000 && _setNormalization( GEO_NORM_PER1000 )
        }>
        Complaints per 1,000 <span>population</span>
      </button>
    </section>
  );
};
