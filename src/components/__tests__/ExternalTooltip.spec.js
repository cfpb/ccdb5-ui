import * as trendsUtils from '../../utils/trends';
import {
  ExternalTooltip,
  mapDispatchToProps,
  mapStateToProps,
} from '../Trends/ExternalTooltip';
import React from 'react';
import { shallow } from 'enzyme';

describe('buttons', () => {
  let cb = null;
  let cbFocus;
  let target = null;

  beforeEach(() => {
    cb = jest.fn();
    cbFocus = jest.fn();
    target = shallow(
      <ExternalTooltip
        remove={cb}
        lens="Foo"
        add={cbFocus}
        hasCompanyTypeahead={true}
        tooltip={{
          title: 'foo title',
          total: 20,
          values: [
            {
              colorIndex: 1,
              value: 10,
              name: 'foo',
            },
            {
              colorIndex: 2,
              value: 10,
              name: 'bar',
            },
          ],
        }}
      />
    );
  });

  it('remove is called the button is clicked', () => {
    const prev = target.find('.tooltip-ul .color__1 .close');
    prev.simulate('click');
    expect(cb).toHaveBeenCalledWith('foo');
  });
});

describe('mapDispatchToProps', () => {
  it('provides a way to call remove', () => {
    jest.spyOn(trendsUtils, 'scrollToFocus');
    const dispatch = jest.fn();
    mapDispatchToProps(dispatch).remove('Foo');
    expect(dispatch.mock.calls).toEqual([
      [
        {
          filterName: 'company',
          filterValue: 'Foo',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REMOVED',
        },
      ],
    ]);
    expect(trendsUtils.scrollToFocus).not.toHaveBeenCalled();
  });
});

describe('mapStateToProps', () => {
  let state;
  beforeEach(() => {
    state = {
      query: {
        focus: '',
        lens: 'Overview',
      },
      trends: {
        tooltip: {
          title: 'Date: 1/1/2015',
          total: 100,
          values: [],
        },
      },
    };
  });
  it('maps state and props', () => {
    const actual = mapStateToProps(state);
    expect(actual).toEqual({
      focus: '',
      lens: 'Overview',
      hasCompanyTypeahead: false,
      hasTotal: false,
      tooltip: {
        date: '1/1/2015',
        heading: 'Date:',
        title: 'Date: 1/1/2015',
        total: 100,
        values: [],
      },
    });
  });

  it('maps state and props - focus', () => {
    state.query.focus = 'something else';
    const actual = mapStateToProps(state);
    expect(actual.focus).toEqual('focus');
  });

  it('handles broken tooltip title', () => {
    state.trends.tooltip.title = 'something else';
    const actual = mapStateToProps(state);
    expect(actual).toEqual({
      focus: '',
      lens: 'Overview',
      hasCompanyTypeahead: false,
      hasTotal: false,
      tooltip: {
        date: '',
        heading: 'something else:',
        title: 'something else',
        total: 100,
        values: [],
      },
    });
  });
});
