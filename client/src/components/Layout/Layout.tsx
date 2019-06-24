import { Grid } from '@material-ui/core';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import CustomSnackBar from '../UI/CustomSnackBar';
import Header from './Header';
import Modal from './Modal';

interface ILayout {
  showModal: boolean;
  showSnackBar: boolean;
  message: any;
  variant: string;
  content: any;
  title: any;
  children: any;
  className: string;
}

const Layout: FC<ILayout> = ({ children, showModal, title, content, message, showSnackBar, variant, className }) => (
  <>
    <CustomSnackBar message={message} isOpen={showSnackBar} variant={variant} />
    <Header />
    <Grid container={true}>
      <Modal isOpen={showModal} title={title} content={content} className={className} />
      {children}
    </Grid>
  </>
);

const mapStateToProps = ({ app }: ApplicationState) => ({
  showModal: app.showModal,
  title: app.title,
  content: app.content,
  message: app.message,
  showSnackBar: app.showSnackBar,
  variant: app.variant,
  className: app.className
});

export default connect(
  mapStateToProps,
  null
)(Layout);
