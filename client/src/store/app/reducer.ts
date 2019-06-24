import { Reducer } from 'redux';
import { AppActionTypes, AppState } from './types';

export const initialState: AppState = {
  showModal: false,
  content: null,
  title: null,
  showSnackBar: false,
  message: null,
  variant: 'info',
  className: ''
};

export const appReducer: Reducer<AppState> = (state = initialState, { type, payload }) => {
  switch (type) {
    case AppActionTypes.SHOW_MODAL: {
      return {
        ...state,
        showModal: true,
        content: payload.content,
        title: payload.title,
        className: payload.className
      };
    }
    case AppActionTypes.CLOSE_MODAL: {
      return {
        ...state,
        showModal: false,
        content: null,
        title: null,
        className: ''
      };
    }
    case AppActionTypes.CLOSE_SNACKBAR: {
      return {
        ...state,
        showSnackBar: false,
        message: null
      };
    }
    case AppActionTypes.SHOW_SNACKBAR: {
      return {
        ...state,
        showSnackBar: true,
        ...payload
      };
    }
    default: {
      return state;
    }
  }
};
