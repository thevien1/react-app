import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';
import { Avatar, Button, Grid, Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import axios from '../Api/axios';
import { Tabtitle } from './Title';
import Alert from '@material-ui/lab/Alert';
import { useNavigate } from 'react-router-dom';

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

export default function Login(props) {
  Tabtitle('Login')
  const classes = useStyles();
  const md5 = require('md5');
  const history = useNavigate()
  const [errorMessage, setErrorMessage] = useState([]);
  const [input, setInput] = useState({
    email:'',
    password:'',
   });
   const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.get(`?connectLogin=&email=${input.email}&password=${input.password}`)
    if(res.data.length===0){
      return setErrorMessage('The email not found.');
    }
    
    for (var i = 0; i < res.data.length; i++) {
      if(input.email !== res.data[i].email){
        return setErrorMessage('The email not found.');
        } 
        else if(md5(input.password) !== res.data[i].password){
        return setErrorMessage('The password incorrect!');
        } 
        
        if(input.email === res.data[i].email || md5(input.password) === res.data[i].password){
        history('/app/users')
        localStorage.setItem('auth', true)
        localStorage.setItem('id', res.data[i].id)
        }
      }
  }
  return (
    <form className={classes.root} noValidate autoComplete="off">
    <div className={classes.root}>
      <CssBaseline />
      <ElevationScroll {...props}>
      <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
      <Avatar alt="Remy Sharp" src="logo512.png" className={classes.avatar}/>
        </Toolbar>
      </AppBar>
      </ElevationScroll>
        <Toolbar />
        <div className={classes.root}>

    <Paper className={classes.paper} elevation={0}>

      <Grid container item >
      <Typography className={classes.name} >Sign in</Typography>
        <TextField onChange={handleChange} name='email' fullWidth  label="Email Address" variant="outlined"/>
        <div className={classes.formText}></div>
        <TextField onChange={handleChange} name='password' fullWidth type='password'  label="Password" variant="outlined"/>
        <div className={classes.formText}></div>
        {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}
        <Button onClick={handleSubmit} type='submit' variant="contained" color="primary" fullWidth>
  Sign in now
</Button>
        </Grid>
    </Paper>
    </div>
    </div>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  errortext:{
		width:'50%',
		margin:'10px auto',

	  },
  formText:{
    margin:theme.spacing(1),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
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

  paper: {
    maxWidth: 600,
    margin: `${theme.spacing(5)}px auto`,
    padding: theme.spacing(1),
    backgroundColor:`#fafafa`,

  },
  name:{
    fontWeight:500,
    fontSize:'28px',
    margin: theme.spacing(0,0,2,0),
  },
}));
