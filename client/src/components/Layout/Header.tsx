import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { History } from 'history';
import React, { FC } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import axios from '../../axios-instance';
import { ApplicationState } from '../../store';
import * as appActions from '../../store/app/actions';
import * as authActions from '../../store/auth/actions';
import Login from '../Login/Login';
import Oauth from '../Login/Oauth';
import Signup from '../Signup/Signup';
import { ModalProps } from './Modal';
import Navbar from './Navbar';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    modal: {
      width: theme.spacing(10)
    }
  });

interface IHeader extends WithStyles {
  onOpenModal: Function;
  modalOptions?: ModalProps;
  onLogout: Function;
  isAuth: boolean;
  oauthPopup: boolean;
}

const languageMapping: { [key: string]: string } = {
  US: 'en',
  RU: 'ru'
};

const countryMapping: { [key: string]: string } = {
  en: 'US',
  ru: 'RU'
};

const Header: FC<RouteComponentProps & IHeader> = ({ classes, onOpenModal, isAuth, onLogout, oauthPopup, history }) => {
  const { t, i18n } = useTranslation();

  const defaultCountry = countryMapping[String(localStorage.getItem('i18nextLng') || 'en')];

  const openModalLogin = () => {
    onOpenModal({
      isOpen: true,
      content: <Login />,
      title: t('common:buttons.signin'),
      className: classes.modal
    });
  };

  const openModalSignup = () => {
    onOpenModal({ isOpen: true, content: <Signup />, title: t('common:buttons.signup') });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <ReactFlagsSelect
            defaultCountry={defaultCountry}
            countries={['US', 'RU']}
            showSelectedLabel={false}
            customLabels={{ US: 'English', RU: 'Русский' }}
            onSelect={code => {
              i18n.changeLanguage(languageMapping[code]);
              axios.defaults.headers.common['Accept-Language'] = languageMapping[code];
            }}
          />
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {t('common:general.testProject')}
          </Typography>
          {oauthPopup && <Oauth />}
          {isAuth ? (
            <Button color="inherit" onClick={() => onLogout(history)}>
              {t('common:buttons.logout')}
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={openModalLogin}>
                {t('common:buttons.signin')}
              </Button>
              <Button color="inherit" onClick={openModalSignup}>
                {t('common:buttons.signup')}
              </Button>
            </>
          )}
        </Toolbar>
        <Navbar />
      </AppBar>
    </div>
  );
};

const mapStateToProps = ({ auth }: ApplicationState) => {
  return {
    isAuth: Boolean(auth.token),
    oauthPopup: auth.oauthPopup
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onOpenModal: (modalOptions: ModalProps) => dispatch(appActions.showModal(modalOptions)),
  onLogout: (history: History) => dispatch(authActions.logout(history))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Header))
);
