import React from 'react';
import { AdvancedTips } from './AdvancedTips';
import { testRender as render, screen } from '../../../testUtils/test-utils';

describe('AdvancedTips', () => {
  it('renders', () => {
    render(<AdvancedTips />);
    expect(screen.getByText('Advanced search tips')).toBeInTheDocument();
  });
});
