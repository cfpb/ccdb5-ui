// TODO: This and the jest.config.js entry can be removed when enzyme is removed
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
// add custom jest matchers from jest-dom for testing library tests
import '@testing-library/jest-dom';

configure({ adapter: new Adapter() });

jest.useFakeTimers().setSystemTime(new Date('2020-05-06'));
