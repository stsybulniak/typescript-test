import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import { AppState } from './app';
import { appReducer } from './app/reducer';
import { AuthState } from './auth';
import { authReducer } from './auth/reducer';
import authSaga from './auth/sagas';

export interface ApplicationState {
  auth: AuthState;
  app: AppState;
}

export const createRootReducer = () =>
  combineReducers({
    auth: authReducer,
    app: appReducer
  });

export function* rootSaga() {
  yield all([fork(authSaga)]);
}
