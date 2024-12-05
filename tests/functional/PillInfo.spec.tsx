import '@testing-library/react-native/extend-expect';
import { render, screen, } from '@testing-library/react-native';
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

jest.mock('@/components/ServiceButton', () => {
  return {
    __esModule: true,
    default: ({icon}: {icon: string}) => <div>{icon}</div>,
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

describe('PillInfo appearence', () => {

  const pill = {
    id: 1,
    name: 'Pill 1',
    description: 'Description',
    bestBefore: '2025-10-01',
    imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
  }

  beforeAll(() => {
    jest.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(() => '2025-10-01');
  });

  it('Should render', () => {
    render(
      <PillInfo
        imageSize={100}
        pill={pill}
        onDelete={() => {}}
        onEdit={() => {}}
        onImageSizeChanged={() => {}}
        onStartGesture={() => {}}
      />
    );
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('Should contain right data', async () => {
    render(
      <PillInfo
        imageSize={100}
        pill={pill}
        onDelete={() => {}}
        onEdit={() => {}}
        onImageSizeChanged={() => {}}
        onStartGesture={() => {}}
      />
    );
    expect(screen.getByTestId('pill-name-1')).toHaveTextContent(pill.name);
    expect(screen.getByTestId('pill-description-1')).toHaveTextContent(pill.description);
    expect(screen.getByTestId('pill-best-before-1')).toHaveTextContent(`pill_best_before: ${(new Date(pill.bestBefore)).toLocaleDateString()}`);
    expect(screen.getByTestId('pill-image-1')).toHaveProp('source', [{ uri: `data:image/jpg;base64,${pill.imageData}` }]);
  });

});
