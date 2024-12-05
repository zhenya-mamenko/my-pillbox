import t from '@/helpers/localization';


jest.mock('expo-localization', () => ({
  getLocales: () => jest.fn()
    .mockReturnValueOnce([{ languageCode: 'en' }])
    .mockReturnValueOnce([{ languageCode: 'en' }])
    .mockReturnValueOnce([{ languageCode: undefined }]),
}));

jest.mock('@/constants/translations', () => ({
  en: {
    test: 'Test',
  },
}));

describe('Localization', () => {

  test('Translate function', () => {
    expect(t('test')).toBe('Test');
    expect(t('unknown')).toBe('unknown');
    expect(t('test')).toBe('Test');
  });

});
