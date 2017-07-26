import * as sut from '../domUtils'

describe('module::domUtils', () => {
  describe('buildLink', () => {
    beforeEach(() => {
      global.document.createElement = jest.fn().mockImplementation((s) => {
        return {}
      })
    })

    it('creates an anchor tag', () => {
      const actual = sut.buildLink('http://example.com')
      expect(actual).toEqual({
        href: 'http://example.com',
        target: '_blank'
      })
    })

    it('creates a downloading anchor tag', () => {
      const actual = sut.buildLink('http://example.com', 'foo.txt')
      expect(actual).toEqual({
        href: 'http://example.com',
        target: '_blank',
        download: 'foo.txt'
      })
    })
  })

  describe('simulateClick', () => {
    beforeEach(() => {
      global.document.body.appendChild = jest.fn()
      global.document.body.removeChild = jest.fn()
    })

    it('clicks the link', () => {
      const link = {click: jest.fn()}
      sut.simulateClick(link)
      expect(link.click).toHaveBeenCalled()
    })
  })
})
