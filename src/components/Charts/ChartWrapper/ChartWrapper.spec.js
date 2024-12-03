import { testRender as render, screen } from '../../../testUtils/test-utils';
import { ChartWrapper } from './ChartWrapper';

describe('ChartWrapper', () => {
  const renderComponent = ({ hasKey, isEmpty, domId }) => {
    render(<ChartWrapper hasKey={hasKey} isEmpty={isEmpty} domId={domId} />);
  };

  test('It renders wrapper with data', () => {
    renderComponent({ hasKey: false, isEmpty: false, domId: 'some-id' });
    const text = screen.getByText('Date received by the CFPB');
    expect(text).toBeDefined();
    const items = document.getElementsByClassName('ext-tooltip');
    expect(items.length).toBe(0);
  });

  test('It renders wrapper for external tooltip', () => {
    renderComponent({ hasKey: true, isEmpty: false, domId: 'some-id' });
    const text = screen.getByText('Date received by the CFPB');
    expect(text).toBeDefined();
    const items = document.getElementsByClassName('ext-tooltip');
    expect(items.length).toBe(1);
  });
});
