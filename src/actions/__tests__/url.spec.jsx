jest.mock('../complaints');
import { processLocation, urlChanged } from '../url';
import * as sut from '../url';

const locationFixture = {
  hash: '#?from=10&size=100&foo=bar',
  host: 'example.com:3000',
  hostname: 'example.com',
  href: 'http://example.com:3000/path/to/resource/#?from=10&size=100&foo=bar',
  origin: 'http://example.com:3000',
  pathname: '/path/to/resource/',
  port: '3000',
  protocol: 'http:',
  search: '?from=10&size=100&foo=bar',
};

describe('action:url', () => {
  describe('processLocation', () => {
    it('handles empty query strings', () => {
      const location = Object.assign({}, locationFixture);
      location.hash = '';
      location.search = '';

      const { params } = processLocation(location);
      expect(params).toEqual({});
    });
  });

  describe('urlChanged', () => {
    it('creates a simple action', () => {
      const pathname = '/path/to/resource';
      const params = { from: 10, size: 100 };
      const expectedAction = {
        type: sut.URL_CHANGED,
        pathname,
        params,
      };
      expect(urlChanged(pathname, params)).toEqual(expectedAction);
    });
  });
});
