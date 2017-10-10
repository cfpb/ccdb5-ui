import DateInput from '..'
import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme';

function setupEnzyme(initialProps={}) {
  const props = Object.assign({
    debounceWait: 0,
    onChange: jest.fn(),
    onDateEntered: jest.fn(),
    onError: jest.fn()
  }, initialProps)

  const target = mount(<DateInput {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(value='') {
  return renderer.create(
    <DateInput debounceWait={0}
               onDateEntered={jest.fn()}
               onError={jest.fn()}
               value={value} />
  )
}


describe('component::DateInput', () => {
  describe('snapshots', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders an error state', () => {
      const target = setupSnapshot('foo')
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('shows the clear button after text is entered', () => {
      const target = setupSnapshot('12')
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('date entry', () => {
    it('calls onDateEntered when the date is cleared', () => {
      const { target, props } = setupEnzyme({ value: '10/2/2015' })
      const input = target.find('input')
      input.simulate('change', { target: { value: '' }})
      expect(props.onDateEntered).toHaveBeenCalledWith(null)
    })

    it('does not call onDateEntered when value was already null', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input')
      input.simulate('change', { target: { value: '12/' }})
      expect(target.state('asText')).toEqual('12/')
      input.simulate('change', { target: { value: '' }})
      expect(target.state('asText')).toEqual('')
      expect(props.onDateEntered).not.toHaveBeenCalled()
    })

    it('calls onDateEntered when a valid date is entered', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input')
      input.simulate('change', { target: { value: '2/2/2010' }})
      const actual = props.onDateEntered.mock.calls[0][0]
      expect(actual).toEqual(expect.any(Date))
      expect(actual.getFullYear()).toEqual(2010)
      expect(actual.getMonth()).toEqual(2-1)
    })

    it('calls onError when the date is invalid', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input')
      input.simulate('change', { target: { value: '2/31/2012' }})
      expect(props.onError).toHaveBeenCalledWith(
        '\'2/31/2012\' is not a valid date.', '2/31/2012'
      )
    })

    it('calls onError when the date less than the minimum', () => {
      const { target, props } = setupEnzyme( { min: new Date( 2015, 0, 1 ) } )
      const input = target.find('input')
      input.simulate('change', { target: { value: '10/2/2010' } } )
      expect(props.onError).toHaveBeenCalledWith(
        '\'10/2/2010\' must be greater than 1/1/2015', '10/2/2010'
      )
    })

    it('calls onError when the date more than the maximum', () => {
      const { target, props } = setupEnzyme( { max: new Date( 2016, 0, 1 ) } )
      const input = target.find('input')
      input.simulate('change', { target: { value: '10/2/2017' } } )
      expect(props.onError).toHaveBeenCalledWith(
        '\'10/2/2017\' must be less than 1/1/2016', '10/2/2017'
      )
    })

    it('calls onChange for every other change', () => {
      const { target, props } = setupEnzyme()
      const input = target.find('input')
      input.simulate('change', { target: { value: '10/11/20' }})
      expect(props.onChange).toHaveBeenCalledWith( '10/11/20' )
    })
  })

  describe('clear button', () => {
    it('resets the control when clicked', () => {
      const { target, props } = setupEnzyme({ value: '10/2/2015' })
      const input = target.find('button')
      input.simulate('click')
      expect(target.state('asText')).toEqual('')
      expect(props.onDateEntered).toHaveBeenCalledWith(null)
    })
  })

  it('determines the correct starting mode from a string', () => {
    const parameterized = [
      ['1', 'ACCUM'],
      ['e', 'ERROR'],
      ['12', 'ACCUM'],
      ['12/', 'ACCUM'],
      ['12-', 'ACCUM'],
      ['12-1', 'ACCUM'],
      ['12-12', 'ACCUM'],
      ['12-12/20', 'ACCUM'],
      ['12/12/201', 'ACCUM'],
      ['12/12/2012', 'READY'],
      ['2/12/e', 'ERROR']
    ]
    const { target } = setupEnzyme()

    parameterized.forEach(([fixture, expected]) => {
      const actual = target.instance()._initialPhase( fixture )
      expect(actual).toBe(expected)
    })
  })

  describe('no-op callbacks', () => {
    it('provides a no-op callback for onChange', () => {
      const actual = DateInput.defaultProps.onChange()
      expect(actual).toEqual(undefined)
    })
  })

  describe('componentWillReceiveProps', () => {
    it('validates the new properties', () => {
      const {target, props} = setupEnzyme()
      target.instance()._calculateState = jest.fn(() => ({}))
      target.setProps({value: '2016-01-01'})
      expect(target.instance()._calculateState).toHaveBeenCalledWith(
        expect.anything(), '2016-01-01'
      )
    })    
  })
})

