import '@testing-library/react-native/extend-expect';
import { render, screen, } from '@testing-library/react-native';
import App from '@/app/index';


jest.mock('@/hooks/useThemeColor', () => (color: string) => {
  const colors: any = {
    background: '#ffffff',
    primary: '#555555',
    surface: '#ffffff',
    text: '#000000',
  }
  return colors[color];
});

jest.mock('@/helpers/localization', () => ({
  __esModule: true,
  default: (s: string) => s
}));

jest.mock('@/components/PillDialog', () => {
  return {
    __esModule: true,
    default: () => <div />,
  };
});

jest.mock('expo-sqlite/kv-store', () => {
  return {
    __esModule: true,
    default: {
      getItemSync: jest.fn(),
      setItem: jest.fn(),
    },
  };
});

jest.mock('expo-font');
jest.mock('expo-asset');

const mockSQLite = {
  deletePill: jest.fn(),
}
jest.mock('@/helpers/sqlite', () => {
  return {
    __esModule: true,
    close: jest.fn(),
    createDatabase: jest.fn(),
    deletePill: (id: number) => mockSQLite.deletePill(id),
    getPills: jest.fn().mockReturnValue([
      {
        id: 1,
        name: 'Pill 1',
        description: 'Description',
        bestBefore: '2025-10-01',
        imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
      },
    ]),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const GS = jest.requireActual('react-native-gesture-handler');
  return {
    __esModule: true,
    ...GS,
    GestureDetector: ({children}: {children: any}) => <div>{children}</div>,
  };
});

jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
  return {
    __esModule: true,
    default: ({children}: {children: any}) => <div>{children}</div>,
  };
});

jest.mock('react-native-reanimated', () => {
  const RNR = jest.requireActual('react-native-reanimated');
  return {
    __esModule: true,
    ...RNR,
    default: {
      ...RNR.default,
      View: ({children}: {children: any}) => <div>{children}</div>,
    }
  }
});

describe('App', () => {

  it('Should render', () => {
    render(<App />);

    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('Should contain right data', () => {
    render(<App />);
    expect(screen.getByText('Pill 1')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
    expect(screen.getByText(`pill_best_before: ${(new Date('2025-10-01')).toLocaleDateString()}`)).toBeTruthy();
  });

});
