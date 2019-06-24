import { History } from 'history';
import React, { FC, Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { ApplicationState } from '../store';
import * as authActions from '../store/auth/actions';
import './app.scss';
import Layout from './Layout/Layout';
import BackdropSpinner from './UI/BackdropSpinner';
import Routes from '../routes';

interface IApp {
  onAutoLogin: Function;
  authFinish: Boolean;
}

const App: FC<RouteComponentProps & IApp> = ({ onAutoLogin, authFinish, history }) => {
  useEffect(() => {
    onAutoLogin(history);
  }, []);

  return authFinish ? (
    <Suspense fallback={<BackdropSpinner />}>
      <Layout>
        <Routes />
      </Layout>
    </Suspense>
  ) : (
    <BackdropSpinner />
  );
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    isAuth: Boolean(state.auth.token),
    user: state.auth.user,
    authFinish: state.auth.authFinish
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onAutoLogin: (history: History) => dispatch(authActions.autoLogin(history))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
