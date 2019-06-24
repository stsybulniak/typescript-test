import { createMuiTheme } from '@material-ui/core';
import { indigo, pink, red } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
import React from 'react';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import axios from './axios-instance';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { store } from './store/store';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      ns: ['common', 'errors'],
      preload: ['en', 'ru'],
      fallbackLng: 'en',
      lng: String(localStorage.getItem('i18nextLng') || 'en'),
      fallbackNS: 'common',
      defaultNS: 'common',
      backend: {
        loadPath: '/api/locales/{{lng}}/{{ns}}'
        // addPath: 'api/locales/{{lng}}/{{ns}}_missing.json',
      },
      saveMissing: true,
      debug: process.env.NODE_ENV === 'development',
      detection: {
        order: ['localStorage', 'navigator'],
        lookupQuerystring: 'lng',
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage']
      }
    },
    err => {
      localStorage.setItem('i18nextLng', i18n.language);
      axios.defaults.headers.common['Accept-Language'] = i18n.language;
      if (err) {
        console.error('Error loading translation files', err);
      }
    }
  );

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  },
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
    htmlFontSize: 10
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
