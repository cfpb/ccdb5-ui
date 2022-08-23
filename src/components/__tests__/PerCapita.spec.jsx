import React from 'react';
import {mount} from 'enzyme';
import * as redux from 'react-redux';
import {PerCapita} from '../RefineBar/PerCapita';

describe('PerCapita', () => {
  let spyOnUseSelector;
  let spyOnUseDispatch;
  let mockDispatch;

  beforeEach(() => {
    // Mock useSelector hook
    spyOnUseSelector = jest.spyOn(redux, 'useSelector');
    // Mock useDispatch hook
    spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
    // Mock dispatch function returned from useDispatch
    mockDispatch = jest.fn();
    spyOnUseDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render', () => {
    spyOnUseSelector.mockReturnValue(false);
    const wrapper = mount(<PerCapita />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should dispatch dataNormalizationChanged GEO_NORM_NONE action', () => {
    spyOnUseSelector.mockReturnValue('Per 1000 pop.');
    const wrapper = mount(<PerCapita />);
    let button = wrapper.find('.capita');
    expect( button.hasClass( 'selected' ) ).toBeTruthy();

    button = wrapper.find('.raw');
    expect( button.hasClass( 'selected' ) ).toBeFalsy();

    button.simulate('click');
    expect(mockDispatch.mock.calls).toEqual([
      [{
        "type": "DATA_NORMALIZATION_SELECTED",
        "requery": "REQUERY_NEVER",
        "value": "None"
      }]
    ]);
  });

  it('should dispatch dataNormalizationChanged GEO_NORM_PER1000 action', () => {
    spyOnUseSelector.mockReturnValue('None');
    const wrapper = mount(<PerCapita />);
    let button = wrapper.find('.raw');
    expect( button.hasClass( 'selected' ) ).toBeTruthy();

    button = wrapper.find('.capita');
    expect( button.hasClass( 'selected' ) ).toBeFalsy();

    button.simulate('click');
    expect(mockDispatch.mock.calls).toEqual([
      [{
        "type": "DATA_NORMALIZATION_SELECTED",
        "requery": "REQUERY_NEVER",
        "value": "Per 1000 pop."
      }]
    ]);
  });

  it('should skip dataNormalizationChanged action when same', () => {
    spyOnUseSelector.mockReturnValue('None');
    const wrapper = mount(<PerCapita />);
    let button = wrapper.find('.raw');
    expect( button.hasClass( 'selected' ) ).toBeTruthy();

    button.simulate('click');
    expect(mockDispatch.mock.calls).toEqual([]);
  });

} );
