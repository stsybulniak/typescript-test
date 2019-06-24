import { History } from 'history';
import { action } from 'typesafe-actions';
import { AuthActionTypes, LoginResponse } from './types';

export const logoutUser = () => ({ type: AuthActionTypes.AUTH_LOGOUT });

export const logout = (history: History) => action(AuthActionTypes.AUTH_INITIATE_LOGOUT, { history });

export const refreshToken = (history: History) => action(AuthActionTypes.AUTH_REFRESH_TOKEN, { history });

export const login = (payload: { email: string; password: string; history: History }) =>
  action(AuthActionTypes.AUTH_LOGIN, payload);

export const signup = (payload: { name: string; email: string; password: string; history: History }) =>
  action(AuthActionTypes.AUTH_SIGNUP, payload);

export const autoLogin = (history: History) => action(AuthActionTypes.AUTH_AUTO_LOGIN, { history });

export const loginSuccess = (payload: LoginResponse) => action(AuthActionTypes.AUTH_SUCCESS, payload);

export const finishOauthLogin = (payload: { data: LoginResponse; history: History }) =>
  action(AuthActionTypes.AUTH_FINISH_OAUTH, payload);

export const loginOauth = (payload: { provider: string }) => action(AuthActionTypes.AUTH_OAUTH, payload);

export const closeLoginOauth = () => action(AuthActionTypes.AUTH_CLOSE_OAUTH);
