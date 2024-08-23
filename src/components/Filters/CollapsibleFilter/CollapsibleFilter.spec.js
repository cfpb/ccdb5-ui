import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { CollapsibleFilter } from './CollapsibleFilter';

const renderComponent = (theProps, children) => {
  return render(
    <CollapsibleFilter {...theProps}>
      {children ? children : <div>test child element</div>}
    </CollapsibleFilter>,
  );
};

describe('component::CollapsibleFilter', () => {
  const user = userEvent.setup({ delay: null });
  let props;

  beforeEach(() => {
    props = {
      title: 'A Title',
      desc: 'The description',
    };
  });

  describe('initial state', () => {
    it('renders initially as expected', () => {
      renderComponent(props);
      expect(screen.getByText(props.title)).toBeInTheDocument();
      expect(screen.getByText(props.desc)).toBeInTheDocument();
      expect(screen.getByText('test child element')).toBeInTheDocument();
    });
  });

  describe('toggle states', () => {
    it('hides children when Hide button is clicked', async () => {
      renderComponent(props);
      const buttonBefore = screen.getByRole('button');
      await user.click(buttonBefore);

      const buttonAfter = screen.getByRole('button', {
        expanded: false,
      });
      expect(buttonAfter).toBeInTheDocument();
      expect(screen.queryByText('test child element')).not.toBeInTheDocument();
    });

    it('shows children when Show button is clicked', async () => {
      renderComponent(props);
      const buttonBefore = screen.getByRole('button');
      await user.click(buttonBefore);
      await user.click(buttonBefore);

      const buttonAfter = screen.getByRole('button', {
        expanded: true,
      });
      expect(buttonAfter).toBeInTheDocument();
      expect(screen.getByText(props.desc)).toBeInTheDocument();
      expect(screen.getByText('test child element')).toBeInTheDocument();
    });
  });
});
