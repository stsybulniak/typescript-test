import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import { connect } from 'react-redux';
import { ApplicationState } from './store';

interface IRoutes {
  isAuth: boolean;
}

const Routes: FC<IRoutes> = ({ isAuth }) => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    {isAuth && <Route path="/users" component={UsersPage} />}
    <Route component={() => <div>Not Found</div>} />
  </Switch>
);

const mapStateToProps = ({ auth }: ApplicationState) => {
  return {
    isAuth: Boolean(auth.token)
  };
};

export default connect(mapStateToProps)(Routes);
