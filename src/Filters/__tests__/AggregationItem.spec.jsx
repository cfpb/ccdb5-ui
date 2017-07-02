import React from 'react';
import { IntlProvider } from 'react-intl';
import AggregationItemFilter, { AggregationItem, mapDispatchToProps, mapStateToProps } from '../AggregationItem';
import renderer from 'react-test-renderer';

describe('component:AggregationItemFilter', () => {
  let item, fieldName, active, onClick;
  beforeEach(() => {
      item = {key: 'foo', doc_count: 1000};
      fieldName = 'fieldName';
      active = false;
      onClick = jest.fn();
  })

  it('renders without crashing', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <AggregationItem item={item}
                         fieldName={fieldName}
                         active={active}
                         onClick={onClick} />
      </IntlProvider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('mapDispatchToProps hooks into filterChanged', () => {
    const dispatch = jest.fn();
    const ownProps = { fieldName: fieldName, item: item };
    mapDispatchToProps(dispatch, ownProps).onClick({ });
    expect(dispatch.mock.calls.length).toEqual(1);
  });

  it('mapStateToProps returns correct active value when no filter present', () => {
    const state = { query: {} };
    const ownProps = { fieldName: 'timely', item: { key: "Yes" }};
    let propsReturn = mapStateToProps(state, ownProps);
    expect(propsReturn.active).toEqual(false);
  });

  it('mapStateToProps returns correct active value fieldName key matches query', () => {
    const state = {
      query: { timely: ["Yes"] }
    }
    const ownProps = { fieldName: 'timely', item: { key: "Yes"} };
    let propsReturn = mapStateToProps(state, ownProps);
    expect(propsReturn.active).toEqual(true);
  });

  it('mapStateToProps returns correct value when same fieldName passed with different value', () => {
    const state = {
      query: { timely: ["Yes"] }
    }
    const ownProps = { fieldName: 'timely', item: { key: "No"} };
    let propsReturn = mapStateToProps(state, ownProps);
    expect(propsReturn.active).toEqual(false);
  });
})
