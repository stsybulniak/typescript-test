import { History } from 'history';
import { all, fork, put, takeEvery } from 'redux-saga/effects';
import axios from '../../axios-instance';
import { getErrorMessage } from '../../utils';
import { closeModal, showSnackBar } from '../app/actions';
import { store } from '../store';
import { autoLogin, finishOauthLogin, login, loginSuccess, logout, logoutUser, refreshToken, signup } from './actions';
import { AuthActionTypes, LoginResponse } from './types';

const SECONDS_BEFORE_EXPIRE = 5000;

const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};
let refreshTimer: any = null;

function* handleRefreshToken({ payload: { history } }: ReturnType<typeof refreshToken>) {
  try {
    const response: { data: LoginResponse } = yield axios.post('/api/auth/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken')
    });
    yield handleAuthData(response.data, history);
  } catch (err) {
    yield put(logout(history));
  }
}

const dispatchRefreshToken = (history: History) => store.dispatch(refreshToken(history));

const setRefreshTokenTimer = (expire: number, history: History) => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    dispatchRefreshToken(history);
  }, expire);
};

function* handleAuthData(data: LoginResponse, history: History) {
  yield localStorage.setItem('token', data.token);
  yield localStorage.setItem('refreshToken', data.refreshToken);
  yield (axios.defaults.headers.common.Authorization = data.token);
  const parsedToken = yield parseJwt(data.token);
  const expirationDate = yield new Date(parsedToken.exp * 1000);
  const refreshTime = yield expirationDate.getTime() - new Date().getTime() - SECONDS_BEFORE_EXPIRE;
  yield setRefreshTokenTimer(refreshTime, history);
  yield put(loginSuccess(data));
}

function* handleOauthData({ payload: { data, history } }: ReturnType<typeof finishOauthLogin>) {
  yield handleAuthData(data, history);
}

function* handleLogin({ payload: { email, password, history } }: ReturnType<typeof login>) {
  try {
    const response: { data: LoginResponse } = yield axios.post('/api/auth/signin', { email, password });
    yield handleAuthData(response.data, history);
    yield put(closeModal());
  } catch (err) {
    yield put(logout(history));
    yield put(showSnackBar({ message: getErrorMessage(err), variant: 'error' }));
  }
}

export function* handleLogout({ payload: { history } }: ReturnType<typeof logout>) {
  yield clearTimeout(refreshTimer);
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('refreshToken');
  yield put(logoutUser());
  yield history.push('/');
}

export function* handleAutoLogin({ payload: { history } }: ReturnType<typeof autoLogin>) {
  const token = yield localStorage.getItem('refreshToken');
  if (!token) {
    return yield put(logout(history));
  }

  const parsedToken = yield parseJwt(token);
  const expirationDate = yield new Date(parsedToken.exp * 1000);
  if (expirationDate <= new Date()) {
    yield put(logout(history));
  } else {
    yield handleRefreshToken({ type: AuthActionTypes.AUTH_REFRESH_TOKEN, payload: { history } });
  }
}

export function* handleSignup({ payload: { name, email, password, history } }: ReturnType<typeof signup>) {
  try {
    const response: { data: LoginResponse } = yield axios.post('/api/auth/signup', { email, password, name });
    yield handleAuthData(response.data, history);
    yield put(closeModal());
  } catch (err) {
    yield put(logout(history));
    yield put(showSnackBar({ message: getErrorMessage(err), variant: 'error' }));
  }
}

function* watchAuthSaga() {
  yield takeEvery(AuthActionTypes.AUTH_LOGIN, handleLogin);
  yield takeEvery(AuthActionTypes.AUTH_INITIATE_LOGOUT, handleLogout);
  yield takeEvery(AuthActionTypes.AUTH_REFRESH_TOKEN, handleRefreshToken);
  yield takeEvery(AuthActionTypes.AUTH_AUTO_LOGIN, handleAutoLogin);
  yield takeEvery(AuthActionTypes.AUTH_SIGNUP, handleSignup);
  yield takeEvery(AuthActionTypes.AUTH_FINISH_OAUTH, handleOauthData);
}

// fork() here to split our saga into multiple watchers.
function* authSaga() {
  yield all([fork(watchAuthSaga)]);
}

export default authSaga;
