import { mount, shallow } from 'enzyme';
import ReduxPagination, {
  Pagination,
  mapStateToProps,
  mapDispatchToProps,
} from '../List/Pagination';
import configureMockStore from 'redux-mock-store';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

function setupSnapshot() {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      page: 1,
      size: 25,
      totalPages: 100,
    },
  });

  return renderer.create(
    <IntlProvider locale="en">
      <Provider store={store}>
        <ReduxPagination />
      </Provider>
    </IntlProvider>
  );
}

describe('component::Pagination', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot();
    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('buttons', () => {
    let nextCb = null;
    let prevCb = null;
    let target = null;

    beforeEach(() => {
      nextCb = jest.fn();
      prevCb = jest.fn();

      window.scrollTo = jest.fn();
      target = shallow(<Pagination nextPage={nextCb} prevPage={prevCb} />);
    });

    it('prevPage is called when the previous button is clicked', () => {
      const prev = target.find('.m-pagination_btn-prev');
      prev.simulate('click');
      expect(nextCb).not.toHaveBeenCalled();
      expect(prevCb).toHaveBeenCalled();
    });

    it('nextPage is called when the next button is clicked', () => {
      const next = target.find('.m-pagination_btn-next');
      next.simulate('click');
      expect(prevCb).not.toHaveBeenCalled();
      expect(nextCb).toHaveBeenCalled();
    });
  });

  describe('button states', () => {
    it('enables the previous button when it is past first page', () => {
      const target = shallow(<Pagination page={3} total={10} />);
      const prev = target.find('.m-pagination_btn-prev');
      expect(prev.props().disabled).toEqual(false);
    });

    it('disables the previous button when on the first page', () => {
      const target = shallow(<Pagination page={1} total={10} />);
      const prev = target.find('.m-pagination_btn-prev');
      expect(prev.props().disabled).toEqual(true);
    });

    it('enables the next button when not on the last page', () => {
      const target = shallow(<Pagination page={2} total={10} />);
      const next = target.find('.m-pagination_btn-next');
      expect(next.props().disabled).toEqual(false);
    });

    it('disables the next button when on the last page', () => {
      const target = shallow(<Pagination page={10} total={10} />);
      const next = target.find('.m-pagination_btn-next');
      expect(next.props().disabled).toEqual(true);
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into nextPage', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).nextPage();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
    it('hooks into prevPage', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).prevPage();
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          page: 1,
          size: 25,
          totalPages: 100,
        },
      };
      let actual = mapStateToProps(state);
      expect(actual).toEqual({ page: 1, size: 25, total: 100 });
    });
  });
});
