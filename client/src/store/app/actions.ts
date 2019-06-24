import { action } from 'typesafe-actions';
import { ModalProps } from '../../components/Layout/Modal';
import { AppActionTypes } from './types';

export const showModal = (payload: ModalProps) => action(AppActionTypes.SHOW_MODAL, payload);

export const showSnackBar = (payload: { message: any; variant: string }) =>
  action(AppActionTypes.SHOW_SNACKBAR, payload);

export const closeModal = () => action(AppActionTypes.CLOSE_MODAL);

export const closeSnackBar = () => action(AppActionTypes.CLOSE_SNACKBAR);
