import React, { useEffect, useRef, useState } from 'react'
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';

import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import { Card, CardMedia, CircularProgress, Divider, Grid, IconButton, InputAdornment, OutlinedInput, Typography } from '@material-ui/core';
import axios from '../Api/axios';
import EditIcon from '@material-ui/icons/Edit';
import { Delete } from '@material-ui/icons';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';

const Games = () => {
    Tabtitle('Games')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const idProductRef = useRef()
    const idProductRefpage = useRef()
    const idProductRef_name = useRef()
    const [students, setStudents] = useState([]);
    const [Message, setMessage] = useState(false);
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState({
      name:'',
    });
    const SearchText = (e) => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value,
      });
     
    };

useEffect(()=>{
  if(search.name==='' && search.phone===''){
    setMessage(true)
  }
  Promise.all(
    [
      axios.get(`?get_games=&name=${search.name}`), 
    ])
    .then((responses) => {
      setProduct(responses[0].data)
    })
    .catch(error => console.error(error));
},[search])

   setTimeout(function() {
    setMessage(false)
    }, 200);
    const handleDelete = async () => {
      await axios.post(`?delete_user=${idProductRef.current}`);
      var newstudent = students.filter((item) => {
       return item.id !== idProductRef.current;
      })
      setMessage(true)
      setOpen(false);
      setStudents(newstudent);
    }
    const handleClickOpen = (id,page,name) => {
      setOpen(true);
      idProductRef.current = id;
      idProductRefpage.current = page;
      idProductRef_name.current = name;
    };
  
    const handleClose = () => {
      setOpen(false);
    };

  return (
    <div>
      <NavLink to='/app/games/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD GAME</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container spacing={1} >
          <Grid item  lg={4} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Select a name"   name='name'     
            startAdornment={<InputAdornment position="start"><SearchIcon color="action"/></InputAdornment>}
          ></OutlinedInput>
          </Grid>

        </Grid>
        </Paper>
      </Grid>
      {Message && 
      <div className={classes.center}>
      <CircularProgress />
      </div>
      }
      <Grid container spacing={3}>
    {product.map((item) => (
      <Grid item key={item.id} lg={3} md={6} sm={12} xs={12} className={classes.griditem2}>
        <Card className={classes.card}>
          <CardMedia className={classes.img} component='img' image={`/Images/${item.image}`} />
          <Typography variant='h4' className={classes.namegame} >{item.name}</Typography>
          <Divider/>
          <Typography variant='h5' className={classes.namegame2} >{item.description}</Typography>
          <Divider/>
          <div className={classes.iconw}>
          <NavLink to={`/app/games/${item.id}`} >
          <IconButton color='primary' >
            <AddToQueueIcon/>
          </IconButton>
          </NavLink>
          <NavLink to={`/app/games/edit/${item.id}`} >
          <IconButton color="primary" >
                <EditIcon/>
                </IconButton>
                </NavLink>
                <IconButton color="primary"  onClick={() => handleClickOpen(item.id)}>
                <Delete  />
                </IconButton>
          </div>
        </Card>
      </Grid>
      ))} 
    </Grid>
    <Dialog
        open={open} 
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent className={classes.textColor}>
          <DialogContentText  >
          Are you sure to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>Cancel</Button>
          <Button onClick={handleDelete} autoFocus color='primary'>
          Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Games

const useStyles = makeStyles((theme) => ({
link:{
    padding:theme.spacing(0,0,2,0),
    color:'inherit',
    textDecoration:'none', 
    float: 'right',
    '&.active > div':{
        color:theme.palette.primary.main,
    }
},
centerGrid:{
    width:'100%',
    height:'auto',
    margin:'40px auto',
    [theme.breakpoints.down("sm")]:{
      width:'100%',
    },    
},
paper: {
    flexGrow: 1,
    padding: theme.spacing(3),
    margin: 'auto',
    [theme.breakpoints.down("sm")]:{
    height: 'auto',
  }, 
},

center:{
  display:'flex',
  justifyContent:'center',
},img:{
  height:'200px',
  objectFit:'fill',
},
iconw:{
  padding:theme.spacing(1),
  justifyContent:'center',
  textAlign:'center',
},
namegame2:{
  textAlign:'center',
  fontSize: theme.typography.pxToRem(16),
  fontWeight: 500,
  padding: theme.spacing(1),
},
namegame:{
  textAlign:'center',
  fontSize: theme.typography.pxToRem(20),
  fontWeight: 500,
  padding: theme.spacing(2),
},
}));
