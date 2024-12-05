
import '@testing-library/react-native/extend-expect';
import { render, screen, userEvent, } from '@testing-library/react-native';
import PillDialog from '@/components/PillDialog';
import { Pill } from '@/types';


global.requestAnimationFrame = jest.fn();

jest.mock('@/hooks/useThemeColor', () => (color: string) => {
  const colors: any = {
    background: '#ffffff',
    border: '#000000',
    borderDim: '#ccccccc',
    primary: '#555555',
    surface: '#ffffff',
    text: '#000000',
    textDim: '#888888',
  }
  return colors[color];
});

jest.mock('@/helpers/localization', () => ({
  __esModule: true,
  default: (s: string) => s
}));

jest.mock('@birdwingo/react-native-swipe-modal', () => {
  const { forwardRef } = require('react');
  return {
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: forwardRef(({children}: {children: any}, ref: any) => <div>{children}</div>),
  };
});

const mockSQLite = {
  insertPill: jest.fn(),
  updatePill: jest.fn(),
}
jest.mock('@/helpers/sqlite', () => {
  return {
    __esModule: true,
    insertPill: (pill: Pill) => mockSQLite.insertPill(pill),
    updatePill: (pill: Pill) => mockSQLite.updatePill(pill),
  };
});

describe('PillDialog', () => {

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
      <PillDialog
        pill={pill}
        provideActions={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('Should contain right data', async () => {
    render(
      <PillDialog
        pill={pill}
        provideActions={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByTestId('dialog-title')).toHaveTextContent('pill_edit');
    expect(screen.getByTestId('dialog-name-input')).toHaveDisplayValue(pill.name);
    expect(screen.getByTestId('dialog-description-input')).toHaveDisplayValue(pill.description);
    expect(screen.getByTestId('dialog-best-before')).toHaveTextContent(`pill_best_before: ${(new Date(pill.bestBefore)).toLocaleDateString()}`);
    expect(screen.getByTestId('dialog-image')).toHaveProp('source', [{ uri: `data:image/jpg;base64,${pill.imageData}` }]);
  });

  it('Should call savePill', async () => {
    render(
      <PillDialog
        pill={pill}
        provideActions={() => {}}
        onClose={() => {}}
      />
    );

    const user = userEvent.setup();
    await user.press(screen.getByTestId('dialog-save-button'));

    expect(mockSQLite.updatePill).toHaveBeenCalledWith(pill);
  });

  it('Should call insertPill', async () => {
    const newPill: Pill = {...pill};
    delete newPill.id;
    newPill.name = '';
    newPill.description = '';
    render(
      <PillDialog
        pill={newPill}
        provideActions={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByTestId('dialog-save-button')).toBeDisabled();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('pill_add');

    const user = userEvent.setup();
    await user.type(screen.getByTestId('dialog-name-input'), 'Pill 2');
    await user.type(screen.getByTestId('dialog-description-input'), 'Description 2');

    expect(screen.getByTestId('dialog-save-button')).not.toBeDisabled();

    await user.press(screen.getByTestId('dialog-save-button'));

    expect(mockSQLite.insertPill).toHaveBeenCalledWith({ ...newPill, name: 'Pill 2', description: 'Description 2' });
  });

});
