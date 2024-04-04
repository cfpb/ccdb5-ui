import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { LensTabs } from '../Trends/LensTabs';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';

/**
 *
 * @param {object} root0 - Root state
 * @param {string} root0.focus - Focus
 * @param {string} root0.lens - Lens
 * @param {Array} root0.results - Results array
 * @returns {void}
 */
function setupSnapshot({ focus, lens, results }) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      focus,
      lens,
      subLens: 'sub_product',
    },
    trends: {
      results,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <LensTabs showTitle={true} />
      </IntlProvider>
    </Provider>,
  );
}

describe('component:LensTabs', () => {
  let fixture;
  beforeEach(() => {
    fixture = {
      focus: '',
      lens: 'Overview',
      results: {},
    };
  });

  it('does not render when Overview', () => {
    const target = setupSnapshot(fixture);
    const tree = target.toJSON();
    expect(tree).toBeNull();
  });

  it('renders Product without crashing', () => {
    fixture.lens = 'Product';
    const target = setupSnapshot(fixture);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders focus Product tab without crashing', () => {
    fixture.focus = 'fooBar';
    fixture.lens = 'Product';
    fixture.results = {
      'sub-product': [1, 2, 3],
    };

    const target = setupSnapshot(fixture);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('hides focus Product tab without crashing', () => {
    fixture.focus = 'fooBar';
    fixture.lens = 'Product';
    fixture.results = {
      issue: [1, 2, 3],
      'sub-product': [],
    };

    const target = setupSnapshot(fixture);
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('buttons', () => {
    let cb = null;
    let target = null;

    beforeEach(() => {
      cb = jest.fn();
      target = shallow(
        <LensTabs
          onTab={cb}
          lens="Product"
          hasProductTab={true}
          subLens="Issue"
          showTitle={true}
        />,
      );
    });

    it('tabChanged is called with Product when the button is clicked', () => {
      const prev = target.find('.tabbed-navigation button.sub_product');
      prev.simulate('click');
      expect(cb).toHaveBeenCalledWith('Product', 'sub_product');
    });

    it('tabChanged is called with Issue when the button is clicked', () => {
      const prev = target.find('.tabbed-navigation button.issue');
      prev.simulate('click');
      expect(cb).toHaveBeenCalledWith('Product', 'issue');
    });
  });
});
