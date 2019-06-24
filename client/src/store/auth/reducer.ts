import { Reducer } from 'redux';
import { AuthActionTypes, AuthState } from './types';

export const initialState: AuthState = {
  isLoading: false,
  authFinish: false,
  token: '',
  refreshToken: '',
  user: null,
  oauthPopup: false,
  provider: ''
};

export const authReducer: Reducer<AuthState> = (state = initialState, { type, payload = {} }) => {
  const { provider, user, token, refreshToken } = payload;
  switch (type) {
    case AuthActionTypes.AUTH_LOGIN: {
      return { ...state, isLoading: true };
    }
    case AuthActionTypes.AUTH_SUCCESS: {
      return { ...state, isLoading: false, user, token, refreshToken, authFinish: true };
    }
    case AuthActionTypes.AUTH_LOGOUT: {
      return { ...state, isLoading: false, user: null, token: '', refreshToken: '', authFinish: true };
    }
    case AuthActionTypes.AUTH_OAUTH: {
      return { ...state, isLoading: false, oauthPopup: true, provider };
    }
    case AuthActionTypes.AUTH_CLOSE_OAUTH: {
      return { ...state, oauthPopup: false, provider: '' };
    }
    default: {
      return state;
    }
  }
};
