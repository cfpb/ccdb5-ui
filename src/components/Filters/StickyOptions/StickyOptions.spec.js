import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { StickyOptions } from './StickyOptions';

const fixture = [
  { key: 'DC', doc_count: 999 },
  { key: 'MS', doc_count: 99 },
  { key: 'WA', doc_count: 9 },
];

const renderComponent = (theProps) => render(<StickyOptions {...theProps} />);
const user = userEvent.setup({ delay: null });

describe('component::StickyOptions', () => {
  let props;

  beforeEach(() => {
    props = {
      fieldName: 'foo',
      options: fixture,
      selections: [],
    };
  });

  test('should render an initially selected option', () => {
    props.selections = ['DC'];
    renderComponent(props);
    expect(screen.getByLabelText('DC')).toBeInTheDocument();
  });

  test('should render nothing when no selections are made', () => {
    renderComponent(props);
    const listElement = screen.getByRole('list');
    //ul element should have no child elements)
    expect(listElement.childNodes.length).toBe(0);
  });

  test('should update properly with an additional selection', async () => {
    props.selections = ['DC', 'WA'];
    renderComponent(props);
    const checkboxes = screen.getAllByRole('checkbox');

    //both options should still be present, regardless of checkbox states
    checkboxes.forEach(async (checkbox) => {
      await user.click(checkbox);
    });

    props.selections.forEach((selection) => {
      expect(screen.getByLabelText(selection)).toBeInTheDocument();
    });
  });

  test('should not render selection when its not part of options', () => {
    props.selections = ['DC'];
    props.options = [];
    renderComponent(props);
    expect(screen.queryByLabelText('DC')).not.toBeInTheDocument();
  });
});
