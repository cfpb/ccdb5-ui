import React from 'react';
import { testRender as render } from '../../../testUtils/test-utils';
import HighlightingOption from './HighlightingOption';

describe('HighlightingOption', () => {
  test('Renders partially bolded text', () => {
    const { container } = render(
      <HighlightingOption label="Maryland (MD)" position={0} value="mar" />
    );

    expect(container.innerHTML).toEqual(`<span><b>Mar</b>yland (MD)</span>`);
  });

  test('Handles position < 0', () => {
    const { container } = render(
      <HighlightingOption label="Maryland (MD)" position={-1} value="" />
    );

    expect(container.innerHTML).toEqual(`<span>Maryland (MD)</span>`);
  });
});
