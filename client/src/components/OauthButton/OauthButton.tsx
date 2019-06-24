import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { Dispatch } from 'redux';
import * as appActions from '../../store/app/actions';
import * as actions from '../../store/auth/actions';
import { connect } from 'react-redux';

interface IOauthButton {
  onLoginOauth: Function;
  onCloseLoginOauth: Function;
  closeModal: Function;
  provider: string;
  name: string;
}

const OauthButton: FC<IOauthButton> = ({ provider, name, onCloseLoginOauth, closeModal, onLoginOauth }) => {
  const loginOauth = (provider: string) => {
    onCloseLoginOauth();
    closeModal();
    window.setTimeout(() => onLoginOauth({ provider }), 0);
  };

  return (
    <Button type="button" fullWidth={true} variant="contained" color="primary" onClick={() => loginOauth(provider)}>
      {name}
    </Button>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(appActions.closeModal()),
  onLoginOauth: (payload: { provider: string }) => dispatch(actions.loginOauth(payload)),
  onCloseLoginOauth: () => dispatch(actions.closeLoginOauth())
});

export default connect(
  null,
  mapDispatchToProps
)(OauthButton);
