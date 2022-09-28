import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import MockDate from 'mockdate';

configure({ adapter: new Adapter() });

global.fetch = jest.fn().mockImplementation((url) => {
  expect(url).toContain('@@API');

  return new Promise((resolve) => {
    resolve({
      json: function () {
        return ['foo', 'bar', 'baz', 'qaz'];
      },
    });
  });
});

Object.defineProperty(document, 'referrer', {
  configurable: true,
  value: 'http://www.example.org',
});

// Date and time (EDT): Tuesday, May 5, 2020 12:00:00 AM
window.MAX_DATE = Date.UTC(2020, 4, 5, 4);

MockDate.set('5/5/2020');
