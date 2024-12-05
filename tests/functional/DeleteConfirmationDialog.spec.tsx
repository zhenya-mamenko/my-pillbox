import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';


global.requestAnimationFrame = jest.fn();

jest.mock('@/hooks/useThemeColor', () => (color: string) => {
  const colors: any = {
    background: '#ffffff',
    text: '#000000',
  }
  return colors[color];
});

jest.mock('@/helpers/localization', () => ({
  __esModule: true,
  default: (s: string) => s
}));

describe('DeleteConfirmationDialog', () => {

  it('Should render', () => {
    render(<DeleteConfirmationDialog showDialog={true} onClose={() => {}} onDelete={() => {}} />);

    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('Should contain right data', async() => {
    render(<DeleteConfirmationDialog showDialog={true} onClose={() => {}} onDelete={() => {}} />);

    await waitFor(async () => {
      expect(await screen.getByText('delete_confirmation_description')).toBeTruthy();
      expect(await screen.getByText('delete_confirmation_header')).toBeTruthy();
    });
  });

  it('Should call onClose', async () => {
    const onClose = jest.fn();
    render(<DeleteConfirmationDialog showDialog={true} onClose={onClose} onDelete={() => {}} />);

    await waitFor(async () => {
      expect(await screen.getByText('delete_confirmation_header')).toBeTruthy();
    });

    const user = userEvent.setup();
    await user.press(screen.getByTestId('cancel-button'));

    expect(onClose).toHaveBeenCalled();
  });

  it('Should call onDelete', async () => {
    const onDelete = jest.fn();
    render(<DeleteConfirmationDialog showDialog={true} onClose={() => {}} onDelete={onDelete} />);

    await waitFor(async () => {
      expect(await screen.getByText('delete_confirmation_header')).toBeTruthy();
    });

    const user = userEvent.setup();
    await user.press(screen.getByTestId('delete-button'));

    expect(onDelete).toHaveBeenCalled();
  });

});
