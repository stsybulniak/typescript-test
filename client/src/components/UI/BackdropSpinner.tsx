import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { FC } from 'react';

const styles = () =>
  createStyles({
    progress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 60
    }
  });

interface BackdropSpinnerProps extends WithStyles {}

const BackdropSpinner: FC<BackdropSpinnerProps> = ({ classes }) => (
  <>
    <Backdrop open={true} />
    <div className={classes.progress}>
      <CircularProgress />
    </div>
  </>
);

export default withStyles(styles)(BackdropSpinner);
