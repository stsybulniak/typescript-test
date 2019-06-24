import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import { History } from 'history';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { ApplicationState } from '../../store';
import * as actions from '../../store/auth/actions';
import LoginForm from './LoginForm';

const styles: any = (theme: Theme) =>
  createStyles({
    progress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 60
    }
  });

interface FormProps {
  email: string;
  password: string;
  onsubmit?: Function;
}

interface ILogin extends WithStyles {
  isLoading: boolean;
  onLogin: Function;
  authPopup?: boolean;
}

const Login: React.FC<RouteComponentProps & ILogin> = ({ classes, isLoading, history, onLogin }) => {
  const { t } = useTranslation();

  const validationSchema: any = (props: FormProps) => {
    return Yup.lazy(({ email }: FormProps) => {
      return Yup.object().shape({
        email: Yup.string()
          .email(t('errors:validation.emailNotValid', { value: email }))
          .required(t('errors:validation.fieldRequired')),
        password: Yup.string()
          .min(6, t('errors:validation.shotPassword', { minlength: 6 }))
          .required(t('errors:validation.fieldRequired'))
      });
    });
  };
  const values: FormProps = { email: '', password: '' };

  return (
    <div className={classes.container}>
      {isLoading && (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )}
      <Formik
        render={(props: any) => <LoginForm {...props} />}
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={(values: FormProps) => onLogin({ ...values, history })}
      />
    </div>
  );
};

const mapStateToProps = ({ auth }: ApplicationState) => {
  return {
    isLoading: auth.isLoading
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLogin: (payload: { email: string; password: string; history: History }) => dispatch(actions.login(payload))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Login))
);
