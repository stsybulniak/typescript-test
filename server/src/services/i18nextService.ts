import i18next from 'i18next';
import i18nMidelware from 'i18next-express-middleware';
import i18nFSBackend from 'i18next-node-fs-backend';
import path from 'path';
import { isTest, isDev } from '../utils';

export const i18nextInit = () => {
  i18next
    .use(i18nMidelware.LanguageDetector)
    .use(i18nFSBackend)
    .init(
      {
        // debug: isDev,
        ns: ['common', 'errors'],
        preload: ['en', 'ru', 'ua'],
        fallbackLng: 'en',
        fallbackNS: 'common',
        backend: {
          loadPath: isDev
            ? path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json')
            : `${__dirname}/locales/{{lng}}/{{ns}}.json`,
          addPath: isDev
            ? path.resolve(__dirname, '../locales/{{lng}}/{{ns}}_missing.json')
            : `${__dirname}/locales/{{lng}}/{{ns}}_missing.json`
        },
        saveMissing: true
      },
      (err, t) => {
        if (err) {
          console.log('Translation not initialized');
          // process.exit(-1);
        }
      }
    );
};
