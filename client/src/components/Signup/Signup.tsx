import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import { History } from 'history';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { ApplicationState } from '../../store';
import * as actions from '../../store/auth/actions';
import SignupForm from './SignupForm';

const styles: any = (theme: Theme) =>
  createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    progress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 60
    }
  });

interface FormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ILogin extends WithStyles {
  isLoading: boolean;
  onSignup: Function;
}

const Signup: FC<RouteComponentProps & ILogin> = props => {
  const { t } = useTranslation();

  const validationSchema: any = (props: FormProps) => {
    return Yup.lazy(({ email }: FormProps) => {
      return Yup.object().shape({
        name: Yup.string().required(t('errors:validation.fieldRequired')),
        email: Yup.string()
          .email(t('errors:validation.emailNotValid', { value: email }))
          .required(t('errors:validation.fieldRequired')),
        password: Yup.string()
          .min(6, t('errors:validation.shotPassword', { minlength: 6 }))
          .required(t('errors:validation.fieldRequired')),
        confirmPassword: Yup.string()
          .required(t('errors:validation.fieldRequired'))
          .oneOf([Yup.ref('password')], t('errors:validation.passwordNotMatch'))
      });
    });
  };

  const values: FormProps = { name: '', email: '', password: '', confirmPassword: '' };
  const { classes, isLoading, history, onSignup } = props;

  return (
    <div>
      {isLoading && (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )}
      <Formik
        render={(props: any) => <SignupForm {...props} />}
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={(values: FormProps) => onSignup({ ...values, history })}
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
  onSignup: (payload: { email: string; password: string; name: string; history: History }) =>
    dispatch(actions.signup(payload))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Signup))
);
