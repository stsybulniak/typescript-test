import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent, { SnackbarContentProps } from '@material-ui/core/SnackbarContent';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as appActions from '../../store/app/actions';

const variantIcon: Record<string, any> = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = (theme: Theme) =>
  createStyles({
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme.palette.error.dark
    },
    info: {
      backgroundColor: theme.palette.primary.dark
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 30,
      marginRight: 5
    },
    iconVariant: {
      opacity: 0.9
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'pre-line',
      marginRight: 25
    },
    close: {
      position: 'absolute',
      right: theme.spacing(0.5),
      top: theme.spacing(0.5)
    }
  });

export interface ICustomSnackBar extends WithStyles {
  className?: string;
  other?: Record<string, any>; // { [key: string]: any }
  message: string;
  variant: string;
  isOpen: boolean;
  onClose: Function;
}

const CustomSnackBar: FC<ICustomSnackBar & SnackbarContentProps> = props => {
  const { classes, isOpen, className, message, onClose, variant = 'info', ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={isOpen}
      autoHideDuration={6000}
      onClose={() => onClose()}
    >
      <SnackbarContent
        className={classNames(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={() => onClose()}
          >
            <CloseIcon />
          </IconButton>
        ]}
        {...other}
      />
    </Snackbar>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClose: () => dispatch(appActions.closeSnackBar())
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(CustomSnackBar));
