import React from 'react';
import configureMockStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import ReduxFederalState, {
  FederalState,
  mapDispatchToProps,
} from '../FederalState';

const fixture = [
  {
    key: 'DC',
    doc_count: 999,
  },
];

/**
 *
 */
function setupEnzyme() {
  const props = {
    options: fixture,
    forTypeahead: [
      { key: 'AZ', label: 'Arizona (AZ)', normalized: 'arizona (az)' },
      { key: 'CO', label: 'Colorado (CO)', normalized: 'colorado (co)' },
      { key: 'CT', label: 'Connecticut (CT)', normalized: 'connecticut (ct)' },
      { key: 'MD', label: 'Maryland (MD)', normalized: 'maryland (md)' },
      {
        key: 'RI',
        label: 'Rhode Island (RI)',
        normalized: 'rhode island (ri)',
      },
      { key: 'WY', label: 'Wyoming (WY)', normalized: 'wyoming (wy)' },
    ],
    selections: ['DC'],
    hasChildren: true,
    typeaheadSelect: jest.fn(),
  };

  const target = shallow(<FederalState {...props} />);

  return {
    props,
    target,
  };
}

/**
 *
 * @param initialFixture
 */
function setupSnapshot(initialFixture) {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({
    query: {
      state: ['DC'],
    },
    aggs: {
      state: initialFixture,
    },
  });

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxFederalState />
      </IntlProvider>
    </Provider>
  );
}

describe('component::FederalState', () => {
  describe('initial state', () => {
    it('renders empty values without crashing', () => {
      const target = setupSnapshot();
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders without crashing', () => {
      const target = setupSnapshot(fixture);
      const tree = target.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Typeahead interface', () => {
    let target, props;
    beforeEach(() => {
      ({ target, props } = setupEnzyme());
    });

    describe('_onInputChange', () => {
      it('matches state abbreviations first', () => {
        const actual = target.instance()._onInputChange('RI');
        expect(actual.length).toEqual(2);
        expect(actual[0].key).toEqual('RI');
        expect(actual[1].key).toEqual('AZ');
      });

      it('matches state abbreviations first (for code coverage)', () => {
        const actual = target.instance()._onInputChange('CO');
        expect(actual.length).toEqual(2);
        expect(actual[0].key).toEqual('CO');
        expect(actual[1].key).toEqual('CT');
      });

      it('prefers matches early in the string', () => {
        const actual = target.instance()._onInputChange('AR');
        expect(actual.length).toEqual(2);
        expect(actual[0].key).toEqual('AZ');
        expect(actual[1].key).toEqual('MD');
      });
    });

    describe('_renderOption', () => {
      it('produces a custom component', () => {
        const options = target.instance()._onInputChange('ARI');
        const view = target.instance()._renderOption(options[0]);
        expect(view).toEqual({
          value: 'AZ',
          component: expect.anything(),
        });
      });
    });

    describe('_onOptionSelected', () => {
      it('checks all the filters associated with the option', () => {
        const key = 'WY';
        target.instance()._onOptionSelected({ key });
        expect(props.typeaheadSelect).toHaveBeenCalledWith(key);
      });
    });
  });

  describe('StickyOptions interface', () => {
    it('provides the correct label for a missing aggregation', () => {
      const { target } = setupEnzyme();
      const key = 'WY';
      const actual = target.instance()._onMissingItem(key);
      expect(actual).toEqual({
        key,
        doc_count: 0,
        value: 'Wyoming (WY)',
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into addMultipleFilters', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).typeaheadSelect('baz');
      expect(dispatch.mock.calls.length).toEqual(1);
    });
  });
});
