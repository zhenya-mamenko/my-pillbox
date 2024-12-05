import { userEvent, render, screen, waitFor } from '@testing-library/react-native';
import ServiceButton from '@/components/ServiceButton';


jest.mock('@/hooks/useThemeColor', () => (color: string) => {
  const colors: any = {
    background: '#ffffff',
    borderDim: '#ccccccc',
    secondary: '#555555',
  }
  return colors[color];
});

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('ServiceButton', () => {

  it('Should render', () => {
    render(<ServiceButton icon="edit" onPress={() => {}} />);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('Should call onPress', async () => {
    const onPress = jest.fn();
    render(<ServiceButton icon="edit" onPress={onPress} />);
    await waitFor(async () => {
      expect(await screen.getByTestId('serviceButton-edit')).toBeTruthy();
    });
    const user = userEvent.setup();
    await user.press(screen.getByTestId('serviceButton-edit'));
    expect(onPress).toHaveBeenCalled();
  });

});
