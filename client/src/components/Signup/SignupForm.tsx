import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { InjectedFormikProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import OauthButton from '../OauthButton/OauthButton';

const styles = () =>
  createStyles({
    minHeight: {
      minHeight: 70
    }
  });

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormProps extends WithStyles {
  onsubmit: Function;
}

const SignupForm: FC<InjectedFormikProps<FormProps, FormValues>> = props => {
  const {
    values: { name, email, password, confirmPassword },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
    classes
  } = props;

  const { t } = useTranslation();

  const change = (name: keyof FormValues, e: React.FormEvent<HTMLElement>) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.minHeight}>
        <TextField
          id="name"
          name="name"
          helperText={touched.name ? errors.name : ''}
          error={touched.name && Boolean(errors.name)}
          label={t('common:formFields.name')}
          value={name}
          onChange={change.bind(null, 'name')}
          fullWidth={true}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            )
          }}
        />
      </div>
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
      <div className={classes.minHeight}>
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          helperText={touched.confirmPassword ? errors.confirmPassword : ''}
          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
          label={t('common:formFields.confirmPassword')}
          fullWidth={true}
          type="password"
          value={confirmPassword}
          onChange={change.bind(null, 'confirmPassword')}
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
    </form>
  );
};

export default withStyles(styles)(SignupForm);
