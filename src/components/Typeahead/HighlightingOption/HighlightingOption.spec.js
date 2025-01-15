import { testRender as render } from '../../../testUtils/test-utils';
import { HighlightingOption } from './HighlightingOption';

describe('HighlightingOption', () => {
  test('Renders partially bolded text', () => {
    const { container } = render(
      <HighlightingOption label="Maryland (MD)" position={0} value="mar" />,
    );

    expect(container.innerHTML).toBe(`<span><b>Mar</b>yland (MD)</span>`);
  });

  test('Handles position < 0', () => {
    const { container } = render(
      <HighlightingOption label="Maryland (MD)" position={-1} value="" />,
    );

    expect(container.innerHTML).toBe(`<span>Maryland (MD)</span>`);
  });

  test('Renders partially bolded text in the middle', () => {
    const { container } = render(
      <HighlightingOption label="Maryland (MD)" position={2} value="ryl" />,
    );

    expect(container.innerHTML).toBe(`<span>Ma<b>ryl</b>and (MD)</span>`);
  });
});
