import '@testing-library/react-native/extend-expect';
import { userEvent, render, screen, waitFor } from '@testing-library/react-native';
import { getByGestureTestId, fireGestureHandler } from 'react-native-gesture-handler/jest-utils';
import PillInfo from '@/components/PillInfo';


jest.mock('@/hooks/useThemeColor', () => (color: string) => {
  const colors: any = {
    background: '#ffffff',
    border: '#000000',
    borderDim: '#ccccccc',
    secondary: '#555555',
    text: '#000000',
    textDim: '#888888',
  }
  return colors[color];
});

jest.mock('@/helpers/localization', () => ({
  __esModule: true,
  default: (s: string) => s
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'Ic');

jest.mock('react-native-reanimated', () => {
  const RNR = jest.requireActual('react-native-reanimated');
  return {
    __esModule: true,
    ...RNR,
    runOnJS: (fn: any) => fn,
  }
});

describe('PillInfo actions', () => {

  const pill = {
    id: 1,
    name: 'Pill 1',
    description: 'Description',
    bestBefore: '2025-10-01',
    imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
  }

  it('Should call onEdit', async () => {
    const onEdit = jest.fn();
    render(
      <PillInfo
        imageSize={100}
        pill={pill}
        onDelete={() => {}}
        onEdit={onEdit}
        onImageSizeChanged={() => {}}
      />);
    await waitFor(async () => {
      expect(await screen.getByTestId('pill-name-1')).toBeTruthy();
    });
    expect(await screen.getByTestId('button-edit-1')).toBeOnTheScreen();
    const user = userEvent.setup();
    await user.press(screen.getByTestId('button-edit-1'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('Should call onDelete', async () => {
    const onDelete = jest.fn();
    render(
      <PillInfo
        imageSize={100}
        pill={pill}
        onDelete={onDelete}
        onEdit={() => {}}
        onImageSizeChanged={() => {}}
      />);
    await waitFor(async () => {
      expect(await screen.getByTestId('pill-name-1')).toBeTruthy();
    });
    expect(await screen.getByTestId('button-delete-1')).toBeOnTheScreen();
    const user = userEvent.setup();
    await user.press(screen.getByTestId('button-delete-1'));
    expect(onDelete).toHaveBeenCalled();
  });

  it('Should call onImageSizeChanged', async () => {
    const onImageSizeChanged = jest.fn();
    render(
      <PillInfo
        imageSize={100}
        pill={pill}
        onDelete={() => {}}
        onEdit={() => {}}
        onImageSizeChanged={onImageSizeChanged}
      />);

    await waitFor(() => {
      expect(screen.getByTestId('pill-image-1')).toBeTruthy();
    });

    const pinch = getByGestureTestId('pill-image-pinch-1');
    fireGestureHandler(pinch, [
      { scale: 1.5 },
    ]);

    expect(onImageSizeChanged).toHaveBeenCalled();

    onImageSizeChanged.mockClear();
    expect(onImageSizeChanged).not.toHaveBeenCalled();

    const tap = getByGestureTestId('pill-image-double-tap-1');
    fireGestureHandler(tap, [
      { numberOfTouches: 2 },
    ]);

    expect(onImageSizeChanged).toHaveBeenCalled();
  });

});
