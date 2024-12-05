import useThemeColor from '@/hooks/useThemeColor';
import { renderHook } from '@testing-library/react-native';


jest.mock('@/hooks/useDynamicColorScheme', () => ({
  __esModule: true,
  default: jest.fn()
    .mockReturnValueOnce('light')
    .mockReturnValueOnce('dark')
    .mockReturnValueOnce(undefined),
}));

jest.mock('@/constants/palette', () => ({
  __esModule: true,
  default: {
    light: {
      primary: '#000000',
      secondary: '#ffffff',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#000000',
    },
  },
}));

describe('useThemeColor', () => {

  test('Get color', () => {
    const color = renderHook(() => useThemeColor('primary'));

    expect(color.result.current).toBe('#000000');

    color.rerender({});

    expect(color.result.current).toBe('#ffffff');

    color.rerender({});

    expect(color.result.current).toBe('#000000');
  });

});
