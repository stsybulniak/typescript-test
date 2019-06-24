import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { InjectedFormikProps } from 'formik';
import React, { FC, FormEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import OauthButton from '../OauthButton/OauthButton';

const styles = (theme: Theme) =>
  createStyles({
    minHeight: {
      minHeight: theme.spacing(8),
      marginTop: theme.spacing(2)
    }
  });

interface FormValues {
  login: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormProps extends WithStyles {
  onsubmit: Function;
}

const LoginForm: FC<InjectedFormikProps<FormProps, FormValues>> = props => {
  const {
    values: { email, password },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
    classes
  } = props;

  const { t } = useTranslation();

  const change = (name: keyof FormValues, e: FormEvent<HTMLElement>) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  const changeToSignUp = () => {
    console.log('Not implemented yet');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.minHeight}>
        <TextField
          id="email"
          name="email"
          helperText={touched.email ? errors.email : ''}
          error={touched.email && Boolean(errors.email)}
          label={t('common:formFields.email')}
          fullWidth={true}
          value={email}
          onChange={change.bind(null, 'email')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            )
          }}
        />
      </div>
      <div className={classes.minHeight}>
        <TextField
          id="password"
          name="password"
          helperText={touched.password ? errors.password : ''}
          error={touched.password && Boolean(errors.password)}
          label={t('common:formFields.password')}
          fullWidth={true}
          type="password"
          value={password}
          onChange={change.bind(null, 'password')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            )
          }}
        />
      </div>
      <Box mt={2}>
        <Button type="submit" fullWidth={true} variant="contained" color="primary" disabled={!isValid}>
          {t('common:buttons.submit')}
        </Button>
      </Box>
      <Box mt={2}>
        <OauthButton provider="google" name={t('common:buttons.googleLogin')} />
      </Box>
      <Box mt={2}>
        <Typography>
          <Trans i18nKey="common:auth.registerAccountWithLink">
            Don't have an account? <span onClick={changeToSignUp}>Sign Up</span>
          </Trans>
        </Typography>
      </Box>
    </form>
  );
};

export default withStyles(styles)(LoginForm);
