import React from 'react';
import {mount} from 'enzyme';
import * as redux from 'react-redux';
import {NarrativesButtons} from '../RefineBar/NarrativesButtons';

describe('NarrativesButtons', () => {
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
    const wrapper = mount(<NarrativesButtons />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should dispatch filter add action', () => {
    spyOnUseSelector.mockReturnValue(false);
    const wrapper = mount(<NarrativesButtons/>);
    wrapper.find('#refineToggleNarrativesButton').simulate('click');
    expect(mockDispatch.mock.calls).toEqual([
      [
        {
          "filterName": "has_narrative",
          "filterValue": "",
          "requery": "REQUERY_ALWAYS",
          "type": "FILTER_ADDED"
        }]
    ]);
  });

  it('should dispatch filter remove action', () => {
    spyOnUseSelector.mockReturnValue(true);
    const wrapper = mount(<NarrativesButtons/>);
    wrapper.find('#refineToggleNoNarrativesButton').simulate('click')
    expect(mockDispatch.mock.calls).toEqual([
      [
        {
          "filterName": "has_narrative",
          "filterValue": "",
          "requery": "REQUERY_ALWAYS",
          "type": "FILTER_REMOVED"
        }]
    ]);
  });

  it('skips dispatch when not checked', () => {
    spyOnUseSelector.mockReturnValue(false);
    const wrapper = mount(<NarrativesButtons/>);
    wrapper.find('#refineToggleNoNarrativesButton').simulate('click');

    expect(mockDispatch.mock.calls).toEqual([]);
  });

  it('skips dispatch when checked', () => {
    spyOnUseSelector.mockReturnValue(true);
    const wrapper = mount(<NarrativesButtons/>);
    wrapper.find('#refineToggleNarrativesButton').simulate('click');

    expect(mockDispatch.mock.calls).toEqual([]);
  });
});