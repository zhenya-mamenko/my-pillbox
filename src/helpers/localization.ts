import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import translations from '@/constants/translations';

const i18n = new I18n(translations);
i18n.missingTranslation.register('return', (_i18n, scope, options) => scope as string);
i18n.missingBehavior = 'return';
i18n.defaultLocale = 'en';
i18n.enableFallback = true;
i18n.locale = getLocales()[0].languageCode ?? 'en';

const t = i18n.t.bind(i18n);
export default t;
