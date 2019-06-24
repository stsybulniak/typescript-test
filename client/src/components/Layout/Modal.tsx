import { Modal as MUIModal, Paper, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import cn from 'classnames';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as appActions from '../../store/app/actions';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      minWidth: theme.spacing(50),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2),
      outline: 'none',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

export interface ModalProps extends WithStyles {
  content: any;
  isOpen: boolean;
  title: any;
  onCloseModal: Function;
  className: string;
}

const Modal: FC<ModalProps> = ({ content, isOpen, title, onCloseModal, classes, className }) => (
  <MUIModal
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={isOpen}
    onClose={() => onCloseModal()}
  >
    <Paper className={cn(classes.paper, className)}>
      <div>
        {title && <Typography variant="h6">{title}</Typography>}
        <IconButton aria-label="Close" className={classes.closeButton} onClick={() => onCloseModal()}>
          <CloseIcon />
        </IconButton>
      </div>
      {content}
    </Paper>
  </MUIModal>
);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCloseModal: () => dispatch(appActions.closeModal())
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Modal));
