import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme';
import ReduxPillPanel, { PillPanel, mapDispatchToProps } from '../PillPanel'
import renderer from 'react-test-renderer'

function setupEnzyme() {
  const props = {
    filters: [{fieldName: 'company', value: 'Acme'}],
    clearAll: jest.fn()
  }

  const target = shallow(<PillPanel {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(initialQueryState={}) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: initialQueryState
  })

  return renderer.create(
    <Provider store={store}>
      <ReduxPillPanel />
    </Provider>
  )
}

describe('component:PillPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot({
      company: ['Apples', 'Bananas are great'],
    });
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('does not render when there are no filters', () => {
    const target = setupSnapshot();
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('allows the user to clear all filters', () => {
    const { target, props } = setupEnzyme()
    const button = target.find('.clear-all button');

    button.simulate('click');
    expect(props.clearAll).toHaveBeenCalled();
  });

  describe('mapDispatchToProps', () => {
    it('hooks into removeAllFilters', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).clearAll();
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })
})
