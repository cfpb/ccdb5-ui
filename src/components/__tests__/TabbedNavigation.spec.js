import configureMockStore from 'redux-mock-store';
import { TabbedNavigation } from '../TabbedNavigation';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

/**
 *
 * @param {string} tab - The tab
 * @returns {void}
 */
function setupSnapshot(tab) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      tab,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <TabbedNavigation />
    </Provider>,
  );
}

describe('component: TabbedNavigation', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot();
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('shows the List tab', () => {
      const target = setupSnapshot(MODE_LIST);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('shows the Map tab', () => {
      const target = setupSnapshot(MODE_MAP);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('shows the Trends tab', () => {
      const target = setupSnapshot(MODE_TRENDS);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // TODO: this needs to be reimplemented using modern testing-library
  // https://kentcdodds.com/blog/why-i-never-use-shallow-rendering
  // describe('buttons', () => {
  //   let cb = null
  //   let target = null
  //
  //   beforeEach( () => {
  //     cb = jest.fn()
  //     target = shallow( <TabbedNavigation onTab={ cb } /> )
  //   } )
  //
  //   it( 'tabChanged is called with Map when the button is clicked', () => {
  //     const prev = target.find( '.tabbed-navigation button' )
  //     prev.simulate( 'click' )
  //     expect( cb ).toHaveBeenCalledWith('Map')
  //   } )
  //
  //   it( 'tabChanged is called with Trends when the button is clicked', () => {
  //     const prev = target.find( '.tabbed-navigation button.trends' )
  //     prev.simulate( 'click' )
  //     expect( cb ).toHaveBeenCalledWith('Trends')
  //   } )
  //
  //   it( 'tabChanged is called with List when the button is clicked', () => {
  //     const prev = target.find( '.tabbed-navigation button.list' )
  //     prev.simulate( 'click' )
  //     expect( cb ).toHaveBeenCalledWith('List')
  //   } )
  // })
});
