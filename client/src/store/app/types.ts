export const AppActionTypes = {
  SHOW_MODAL: '@@app/SHOW_MODAL',
  CLOSE_MODAL: '@@app/CLOSE_MODAL',
  CLOSE_SNACKBAR: '@@app/CLOSE_SNACKBAR',
  SHOW_SNACKBAR: '@@app/SHOW_SNACKBAR'
};

export interface AppState {
  showModal: boolean;
  className: string;
  content: any;
  title: any;
  showSnackBar: boolean;
  message: any;
  variant: string;
}
