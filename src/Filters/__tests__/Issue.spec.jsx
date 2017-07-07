import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import { shallow } from 'enzyme';
import ReduxIssue, { Issue } from '../Issue'

const fixture = [
  {
    "sub_issue.raw": {
      "buckets": [
        {"key":"Information is not mine","doc_count":7030},
        {"key":"Account status","doc_count":5103}
      ]
    },
    "key": "Incorrect information on credit report",
    "doc_count": 20991
  },
  {
    "sub_issue.raw": {
      "buckets": [
        {"key":"Debt is not mine","doc_count":9990},
        {"key":"Debt was paid","doc_count":4632}
      ],
    },
    "key": "Cont'd attempts collect debt not owed",
    "doc_count": 17244
  },
  {
    "sub_issue.raw": {
      "buckets": [],
    },
    "key": "Loan servicing, payments, escrow account",
    "doc_count": 14605
  },
  {
    "sub_issue.raw": {
      "buckets": [],
    },
    "key": "Loan modification,collection,foreclosure",
    "doc_count": 10716
  },
  {
    "sub_issue.raw": {
      "buckets": [],
    },
    "key": "Dealing with my lender or servicer",
    "doc_count": 7783
  },
  {
    "sub_issue.raw": {
      "buckets": [],
    },
    "key": "Not here",
    "doc_count": 999
  }
]

function setupEnzyme(initial) {
  const props = {
    options: initial,
    forTypeahead: [
      {key: 'Foo', normalized: 'foo'},
      {key: 'Bar', normalized: 'bar'},
      {key: 'Baz', normalized: 'baz'},
    ]
  }

  const target = shallow(<Issue {...props} />);

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
      issue: initial
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxIssue />
      </IntlProvider>
    </Provider>
  )
}

describe('component:Issue', () => {
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

  describe('Typeahead interface', () => {
    let target
    beforeEach(() => {
      ({target} = setupEnzyme(fixture))
    })

    describe('_onInputChange', () => {
      it('produces a custom array of matches', () => {
        const actual = target.instance()._onInputChange('BA')
        expect(actual.length).toEqual(2)
      })
    })

    describe('_renderOption', () => {
      it('produces a custom component', () => {
        const options = target.instance()._onInputChange('FOO')
        const actual = target.instance()._renderOption(options[0])
        expect(actual).toEqual({
          value: 'Foo',
          component: expect.anything()
        })
      })
    })

    describe('_onOptionSelected', () => {
      it('does nothing yet', () => {
        const actual = target.instance()._onOptionSelected({})
      })
    })
  })
})