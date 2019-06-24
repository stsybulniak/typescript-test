import { History } from 'history';
import React, { useEffect, FC } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import io from 'socket.io-client';
import { ApplicationState } from '../../store';
import * as actions from '../../store/auth/actions';
import { RouteComponentProps, withRouter } from 'react-router';
import { isNull } from 'util';
import { LoginResponse } from '../../store/auth/types';

interface IOauth {
  onLoginSuccess: Function;
  onCloseLoginOauth: Function;
  provider: string;
}

const Oauth: FC<RouteComponentProps & IOauth> = ({ onLoginSuccess, onCloseLoginOauth, history, provider }) => {
  const width = 600,
    height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  let opened: Record<string, any> | null = null;
  let check: number | null = null;

  interface Socket {
    connected: boolean;
    close: Function;
  }

  // check whether oauth login window close or not
  const checkPopup = (socket: Socket) => {
    check = window.setInterval(() => {
      if (!isNull(check) && (!opened || opened.closed)) {
        window.clearInterval(check);
        onCloseLoginOauth();
        if (socket.connected) {
          socket.close();
        }
      }
    }, 1000);
  };

  useEffect(() => {
    const socket = io('');
    if (opened) {
      opened.close();
    }
    socket.on('connect', () => {
      socket.on('google', (data: LoginResponse) => {
        onLoginSuccess({ data, history });
        if (opened) {
          opened.close();
        }
      });
      const url = `/api/auth/${provider}?socketId=${socket.id}`;
      opened = window.open(
        url,
        '',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
      );
    });
    checkPopup(socket);
    return () => {
      if (!isNull(check)) {
        clearInterval(check);
      }
      onCloseLoginOauth();
      if (socket.connected) {
        socket.close();
      }
      if (opened) {
        opened.close();
      }
    };
  }, []);

  return null;
};
const mapStateToProps = ({ auth }: ApplicationState) => {
  return {
    provider: auth.provider,
    oauthPopup: auth.oauthPopup
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onLoginSuccess: (payload: { data: LoginResponse; history: History }) => dispatch(actions.finishOauthLogin(payload)),
    onCloseLoginOauth: () => dispatch(actions.closeLoginOauth())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Oauth)
);
