import ReduxSearchPanel, { SearchPanel } from '../SearchPanel';
import configureMockStore from 'redux-mock-store'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router';
import { shallow } from 'enzyme';

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    lastUpdated: new Date(2016 , 1, 1)
  }, initialProps)

  const target = shallow(<SearchPanel {...props} />);

  return {
    target,
    props
  }
}

describe('SearchPanel', () => {
    let target, props
    beforeEach(() => {
      ({ target, props } = setupEnzyme())
    })

    describe('renders', () => {
      it('renders with last updated date', () => {
        expect(target).toMatchSnapshot()
      })
    })
  })