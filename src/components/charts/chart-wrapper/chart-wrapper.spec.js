import { screen, testRender as render } from '../../../test-utils/test-utils';
import { ChartWrapper } from './chart-wrapper';

describe('ChartWrapper', () => {
  const renderComponent = ({ hasKey, isEmpty, domId }) => {
    render(<ChartWrapper hasKey={hasKey} isEmpty={isEmpty} domId={domId} />);
  };

  test('It renders wrapper with data', () => {
    renderComponent({ hasKey: false, isEmpty: false, domId: 'some-id' });
    const text = screen.getByText('Date received by the CFPB');
    expect(text).toBeInTheDocument();
    const items = document.querySelectorAll('.ext-tooltip');
    expect(items.length).toBe(0);
  });

  test('It renders wrapper for external tooltip', () => {
    renderComponent({ hasKey: true, isEmpty: false, domId: 'some-id' });
    const text = screen.getByText('Date received by the CFPB');
    expect(text).toBeInTheDocument();
    const items = document.querySelectorAll('.ext-tooltip');
    expect(items.length).toBe(1);
  });
});
