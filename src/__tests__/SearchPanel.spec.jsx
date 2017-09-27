import { SearchPanel } from '../SearchPanel';
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme';

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    lastUpdated: new Date( '2016-02-01T05:00:00.000Z' )
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