import React from 'react';
import { IntlProvider } from 'react-intl';
import { ActionBar, mapDispatchToProps } from '../ActionBar';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <ActionBar total="100" hits="10" />
      </IntlProvider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    it('hooks into onSize', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onSize({target: { value: '50' }});
      expect(dispatch.mock.calls.length).toEqual(1);
    })

    it('hooks into onSort', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onSort({target: { value: 'foo' }});
      expect(dispatch.mock.calls.length).toEqual(1);
    })

    it('hooks into onExportResults', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onExportResults();
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })
});

