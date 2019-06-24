import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ThumbUp from '@material-ui/icons/ThumbUp';
import React, { FC, useState, useEffect } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    scrollButtons: {
      color: theme.palette.grey[500]
    }
  });

interface INavbar extends WithStyles {
  isAuth: boolean;
}

const Navbar: FC<RouteComponentProps & INavbar> = ({ classes, history, isAuth }) => {
  const [tabIndex, setTabIndex] = useState(history.location.pathname);

  useEffect(() => {
    setTabIndex(history.location.pathname);
  }, [history.location]);

  return (
    <div className={classes.root}>
      <Tabs
        value={tabIndex}
        variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        className={classes.scrollButtons}
      >
        <Tab value="/" label="Home" icon={<ThumbUp />} component={Link} to="/" />
        {isAuth && <Tab value="/users" label="Users" icon={<PersonPinIcon />} component={Link} to="/users" />}
      </Tabs>
    </div>
  );
};

const mapStateToProps = ({ auth }: ApplicationState) => {
  return {
    isAuth: Boolean(auth.token)
  };
};

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Navbar)));
