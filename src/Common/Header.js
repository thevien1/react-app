import React,{useState,useEffect} from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Header = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("auth")) window.location='/login'; 

  }, [logout]);

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth");
    setLogout(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
          <Avatar alt="Remy Sharp" src="logo512.png" className={classes.avatar}/>
          <div  className={classes.title}></div>
          <IconButton edge="start"onClick={handleClickOpen} className={classes.menuButton}   color="inherit" aria-label="menu">
            <ExitToAppIcon/>
          </IconButton>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure to logout the system?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={logoutHandler} autoFocus>
          Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Header

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  avatar: {
    cursor:'pointer',
  },
}));

