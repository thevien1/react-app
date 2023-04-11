import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import {Outlet} from "react-router-dom";
function ElevationScroll(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 0 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};
const drawerWidth = 256;

export default function Dashboard(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <ElevationScroll {...props}>
      <AppBar position="fixed" className={classes.appBar}>
      <Toolbar >
      <Header/>
        </Toolbar>
      </AppBar>
      </ElevationScroll>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
        <Sidebar/>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Outlet/>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down("sm")]:{
      zIndex: 990,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("sm")]:{
      display:"none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));
