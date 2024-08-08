import { testRender as render, screen } from '../../../testUtils/test-utils';
import StickyOptions from './StickyOptions';

const fixture = [
  { key: 'DC', doc_count: 999 },
  { key: 'MS', doc_count: 99 },
  { key: 'WA', doc_count: 9 },
];

const renderComponent = (theProps) => render(<StickyOptions {...theProps} />);

describe('component::StickyOptions', () => {
  let props;

  beforeEach(() => {
    props = {
      fieldName: 'foo',
      options: fixture,
      selections: [],
      onMissingItem: jest.fn(),
    };
  });

  test('should render a selected option', () => {
    props.selections = ['DC'];
    renderComponent(props);
    expect(screen.getByLabelText('DC')).toBeInTheDocument();
  });

  test('should add new selections without removing previous selections', () => {
    props.selections = ['DC', 'MS', 'WA'];
    props.options = [];
    renderComponent(props);
    props.selections.forEach((selection) => {
      expect(screen.queryByLabelText(selection)).not.toBeInTheDocument();
    });
  });

  test('should ask for the missing option when a selection is not in the cache', () => {
    props.selections = ['NJ'];
    renderComponent(props);
    expect(props.onMissingItem).toHaveBeenCalled();
  });
});
