export const AuthActionTypes = {
  AUTH_LOGIN: '@@auth/AUTH_LOGIN',
  AUTH_INITIATE_LOGOUT: '@@auth/AUTH_INITIATE_LOGOUT',
  AUTH_SUCCESS: '@@auth/AUTH_SUCCESS',
  AUTH_REFRESH_TOKEN: '@@auth/AUTH_REFRESH_TOKEN',
  AUTH_LOGOUT: '@@auth/AUTH_LOGOUT',
  AUTH_AUTO_LOGIN: '@@auth/AUTH_AUTO_LOGIN',
  AUTH_SIGNUP: '@@auth/AUTH_SIGNUP',
  AUTH_OAUTH: '@@auth/AUTH_OAUTH',
  AUTH_CLOSE_OAUTH: '@@auth/AUTH_CLOSE_OAUTH',
  AUTH_OAUTH_SUCCESS: '@@auth/AUTH_OAUTH_SUCCESS',
  AUTH_OAUTH_LOGIN: '@@auth/AUTH_OAUTH_LOGIN',
  AUTH_FINISH_OAUTH: '@@auth/AUTH_FINISH_OAUTH'
};

export interface AuthState {
  isLoading: boolean;
  authFinish: boolean;
  token: string;
  refreshToken: string;
  user: Object | null;
  oauthPopup: boolean;
  provider: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Object;
}
