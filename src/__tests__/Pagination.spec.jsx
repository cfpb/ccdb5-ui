import { IntlProvider } from 'react-intl'
import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import {shallow} from 'enzyme'
import { Pagination, mapDispatchToProps } from '../Pagination'

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <Pagination from="175" size="25" total="1000" />
      </IntlProvider>
    )

    let tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('has default values', () => {
    const target = shallow(<Pagination />)
    expect(target.state('current')).toEqual(1)
    expect(target.state('total')).toEqual(0)
    expect(target.state('inputValue')).toEqual(1)
  })
})

describe('componentWillReceiveProps', () => {
  it('receives updates when the parent state changes', () => {
     const target = shallow(<Pagination from="175" size="25" total="1000" />)
     expect(target.state('current')).toEqual(8)

     target.setProps({ from: 200, size: 10 })
     expect(target.state('current')).toEqual(21)
  })
})

describe('onPage', () => {
  let cb = null
  let target = null

  beforeEach(() => {
    cb = jest.fn()
    target = shallow(<Pagination from="175" size="25" total="1000"
                                 onPage={cb} />)
  })

  it('is called when the previous button is clicked', () => {
    const prev = target.find('.m-pagination_btn-prev')
    prev.simulate('click')
    expect(cb).toHaveBeenCalledWith(7)
  })

  it('is called when the next button is clicked', () => {
    const next = target.find('.m-pagination_btn-next')
    next.simulate('click')
    expect(cb).toHaveBeenCalledWith(9)
  })

  it('is called when the form is submitted', () => {
    const theForm = target.find('form')
    theForm.simulate('submit', { preventDefault: () => {} })
    expect(cb).toHaveBeenCalledWith(8)
  })
})

it('records text input from the user', () => {
  const target = shallow(<Pagination from="175" size="25" total="1000" />)
  const textInput = target.find('[type="number"]')

  expect(target.state('inputValue')).toEqual(8)
  // Note: out of range
  textInput.simulate('change', {target: { value: 49}})
  expect(target.state('inputValue')).toEqual(49)  
})

describe('disabled buttons', () => {
  it('disables the previous button when on the first page', () => {
    const target = shallow(<Pagination from="0" size="10" total="100" />)
    const prev = target.find('.m-pagination_btn-prev')
    expect(prev.props().disabled).toEqual(true)
  })

  it('disables the next button when on the last page', () => {
    const target = shallow(<Pagination from="90" size="10" total="100" />)
    const next = target.find('.m-pagination_btn-next')
    expect(next.props().disabled).toEqual(true)
  })
})

describe('mapDispatchToProps', () => {
  it('hooks into onPage', () => {
    const dispatch = jest.fn()
    mapDispatchToProps(dispatch).onPage(99)
    expect(dispatch.mock.calls.length).toEqual(1)
  })
})
