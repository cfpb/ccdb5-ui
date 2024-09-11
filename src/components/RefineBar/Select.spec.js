import { Select } from './Select';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { sizes } from '../../constants';
import userEvent from '@testing-library/user-event';

describe('Select', () => {
  it('renders array values without crashing', async () => {
    const options = ['Uno', 'Dos', 'Tres'];
    const changeSpy = jest.fn();
    // fix for setup here
    // https://github.com/testing-library/user-event/issues/833#issuecomment-1013797822
    const user = userEvent.setup({ delay: null });
    render(
      <Select
        label="Select something"
        title="Show sumthing"
        values={options}
        id="txt"
        value="Dos"
        handleChange={changeSpy}
      />,
    );

    expect(screen.getByRole('option', { name: 'Dos' }).selected).toBe(true);
    expect(screen.getByText('Select something')).toBeInTheDocument();
    const opts = screen.getAllByRole('option');
    expect(opts.length).toBe(3);
    expect(opts[0].value).toBe('Uno');
    expect(opts[1].value).toBe('Dos');
    expect(opts[2].value).toBe('Tres');

    await user.selectOptions(screen.getByRole('combobox'), ['Dos']);
    expect(changeSpy).toHaveBeenCalledTimes(0);

    await user.selectOptions(screen.getByRole('combobox'), ['Tres']);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
  //
  it('renders object values without crashing', async () => {
    const changeSpy = jest.fn();
    const user = userEvent.setup({ delay: null });

    render(
      <Select
        label="Select size"
        title="Show"
        values={sizes}
        id="size"
        value="10"
        handleChange={changeSpy}
      />,
    );
    expect(screen.getByRole('option', { name: '10 results' }).selected).toBe(
      true,
    );
    const opts = screen.getAllByRole('option');
    expect(opts.length).toBe(4);
    expect(opts[0].value).toBe('10');
    expect(opts[1].value).toBe('25');
    expect(opts[2].value).toBe('50');
    expect(opts[3].value).toBe('100');

    await user.selectOptions(screen.getByRole('combobox'), ['10 results']);
    expect(changeSpy).toHaveBeenCalledTimes(0);

    await user.selectOptions(screen.getByRole('combobox'), ['100 results']);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders disabled and selected options', async () => {
    const changeSpy = jest.fn();
    const user = userEvent.setup({ delay: null });

    const options = [
      { name: 'Uno', disabled: true },
      { name: 'Dos', disabled: false },
      { name: 'Tres', disabled: false },
    ];

    render(
      <Select
        label="Select something"
        title="Show sumthing"
        values={options}
        id="txt"
        value="Dos"
        handleChange={changeSpy}
      />,
    );

    expect(screen.getByRole('option', { name: 'Uno' })).toBeDisabled();
    expect(screen.getByRole('option', { name: 'Uno' }).selected).toBe(false);
    const opts = screen.getAllByRole('option');
    expect(opts.length).toBe(3);
    expect(opts[0].value).toBe('Uno');
    expect(opts[1].value).toBe('Dos');
    expect(opts[2].value).toBe('Tres');

    expect(screen.getByRole('option', { name: 'Dos' }).selected).toBe(true);

    await user.selectOptions(screen.getByRole('combobox'), ['Uno']);
    expect(changeSpy).toHaveBeenCalledTimes(0);

    // Currently selected option, do nothing
    await user.selectOptions(screen.getByRole('combobox'), ['Dos']);
    expect(changeSpy).toHaveBeenCalledTimes(0);

    await user.selectOptions(screen.getByRole('combobox'), ['Tres']);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
});
