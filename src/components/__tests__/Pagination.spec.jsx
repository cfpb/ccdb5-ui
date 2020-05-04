import { IntlProvider } from 'react-intl'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount, shallow } from 'enzyme'
import { Pagination, mapStateToProps, mapDispatchToProps } from '../List/Pagination'

describe('component::Pagination', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <Pagination page={1} total={100} />
      </IntlProvider>
    )
    let tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('buttons', () => {
    let onCb = null
    let nextCb = null
    let prevCb = null
    let target = null

    beforeEach(() => {
      onCb = jest.fn()
      nextCb = jest.fn()
      prevCb = jest.fn()

      window.scrollTo = jest.fn();
      target = shallow(<Pagination onPage={onCb}
                                   nextPage={nextCb}
                                   prevPage={prevCb}/>)
    })

    it('prevPage is called when the previous button is clicked', () => {
      const prev = target.find('.m-pagination_btn-prev')
      prev.simulate('click')
      expect(onCb).not.toHaveBeenCalled()
      expect(nextCb).not.toHaveBeenCalled()
      expect(prevCb).toHaveBeenCalled()
    })

    it('nextPage is called when the next button is clicked', () => {
      const next = target.find('.m-pagination_btn-next')
      next.simulate('click')
      expect(onCb).not.toHaveBeenCalled()
      expect(prevCb).not.toHaveBeenCalled()
      expect(nextCb).toHaveBeenCalled()
    })

    it('onPage is called when the form is submitted', () => {
      target.setState({
        page: 8
      });
      const theForm = target.find('form')
      theForm.simulate('submit', { preventDefault: () => {} })
      expect(prevCb).not.toHaveBeenCalled()
      expect(nextCb).not.toHaveBeenCalled()
      expect(onCb).toHaveBeenCalledWith(8)
    })
  })

  it('records text input from the user', () => {
    const target = shallow(<Pagination total={10}/>)
    const textInput = target.find('[type="number"]')
    target.setState({
      page: 8
    });
    expect(target.state('page')).toEqual(8)
    // Note: out of range
    textInput.simulate('change', {target: { value: 49}})
    expect(target.state('page')).toEqual(49)
  })

  it('records empty text input from user', () => {
    const target = shallow(<Pagination />)
    const textInput = target.find('[type="number"]')
    target.setState({
      page: 8
    });
    expect(target.state('page')).toEqual(8)
    // Note: out of range
    textInput.simulate('change', {target: { value: ''}})
    expect(target.state('page')).toEqual('')
  })


  describe('button states', () => {
    it('enables the previous button when it is past first page', () => {
      const target = shallow(<Pagination page={3} total={10} />)
      const prev = target.find('.m-pagination_btn-prev')
      expect(prev.props().disabled).toEqual(false)
    })

    it('disables the previous button when on the first page', () => {
      const target = shallow(<Pagination page={1} total={10} />)
      const prev = target.find('.m-pagination_btn-prev')
      expect(prev.props().disabled).toEqual(true)
    })


    it('enables the next button when not on the last page', () => {
      const target = shallow(<Pagination page={2} total={10} />)
      const next = target.find('.m-pagination_btn-next')
      expect(next.props().disabled).toEqual(false)
    })

    it('disables the next button when on the last page', () => {
      const target = shallow(<Pagination page={10} total={10} />)
      const next = target.find('.m-pagination_btn-next')
      expect(next.props().disabled).toEqual(true)
    })
  })

  describe('componentDidUpdate', () => {
    it('trigger a new update when text changes', () => {
      const props = {
        page: 2,
        total: 10
      }

      const target = mount(<Pagination {...props} />);
      target.setProps({ page: 'bar' })
      const sv = target.state('page')
      expect(sv).toEqual('bar')
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into onPage', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onPage(99)
      expect(dispatch.mock.calls.length).toEqual(1)
    })
    it('hooks into nextPage', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).nextPage()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
    it('hooks into prevPage', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).prevPage()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })

  describe('mapStateToProps', () => {
    it('maps state and props', () => {
      const state = {
        query: {
          page: 1,
          size: 25,
          totalPages: 100
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { page: 1, size: 25, total: 100 } )
    });
  })
})


