import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import { shallow } from 'enzyme';
import ReduxProduct, {Product, mapStateToProps} from '../Product'
import { slugify } from '../../utils'

const fixture = [
  {
    "sub_product.raw": {
      "buckets": [
        {"key": "Credit reporting","doc_count": 3200},
        {"key": "Other personal consumer report","doc_count": 67},
        {"key": "Credit repair services","doc_count": 10}
      ],
    },
    "key": "Credit reporting, credit repair services, or other personal consumer reports",
    "doc_count": 3277
  },
  {
    "sub_product.raw": {
      "buckets": [
        {"key": "Conventional home mortgage","doc_count": 652},
        {"key": "Conventional fixed mortgage","doc_count": 612}
      ],
    },
    "key": "Mortgage",
    "doc_count": 2299
  },
  {
    "sub_product.raw": {
      "buckets": [],
    },
    "key": "Credit reporting",
    "doc_count": 1052
  },
  {
    "sub_product.raw": {
      "buckets": [],
    },
    "key": "Student loan",
    "doc_count": 959
  },
  {
    "sub_product.raw": {
      "buckets": [],
    },
    "key": "Credit card or prepaid card",
    "doc_count": 836
  },
  {
    "sub_product.raw": {
      "buckets": [],
    },
    "key": "Credit card",
    "doc_count": 652
  }
]

function setupEnzyme(initial) {
  const props = {
    options: initial
  }

  const target = shallow(<Product {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(initial) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {},
    aggs: {
      product: initial
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxProduct />
      </IntlProvider>
    </Provider>
  )
}

describe('component:Product', () => {
  describe('snapshots', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot([])
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('only shows the first five items', () => {
      const target = setupSnapshot(fixture)
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('sorting', () => {
    it('places selections ahead of unselected', () => {
      const selected = [
        'Credit reporting, credit repair services, or other personal consumer reports',
        slugify('Credit reporting, credit repair services, or other personal consumer reports', 
          'Other personal consumer report'),
        'Credit card'
      ]
      const actual = mapStateToProps({ 
        query: {product: selected},
        aggs: {product: fixture}
      })
      expect(actual.options[1]).toEqual(fixture[5])
    })

    it('treats child selections as parent selections', () => {
      const selected = [
        slugify("Mortgage", 'Conventional home mortgage')
      ]
      const actual = mapStateToProps({ 
        query: {product: selected},
        aggs: {product: fixture}
      })
      expect(actual.options[0]).toEqual(fixture[1])
    })
  })
})