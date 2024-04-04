import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { FocusHeader } from '../Trends/FocusHeader';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';

/**
 * @returns {void}
 */
function setupSnapshot() {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      focus: 'Foo Bar',
      lens: 'Product',
      subLens: 'sub_product',
    },
    trends: {
      total: 90120,
      results: {
        issue: [2, 3, 4],
        'sub-product': [1, 2, 3],
      },
    },
    results: {
      items: [],
      isLoading: false,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <FocusHeader />
      </IntlProvider>
    </Provider>,
  );
}

describe('component:FocusHeader', () => {
  it('renders both tabs without crashing', () => {
    const target = setupSnapshot();
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('changeFocus is called when the button is clicked', () => {
    const target = shallow(<FocusHeader />);
    const mockRemoveFocus = jest.fn();
    const prev = target.find('#clear-focus');
    prev.simulate('click');
    expect(mockRemoveFocus).toHaveBeenCalled();
  });
});
