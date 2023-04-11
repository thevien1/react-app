import React, { useEffect, useRef, useState } from 'react'
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import {CircularProgress, Divider, Grid, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from '@material-ui/core';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import axios from '../Api/axios';
import EditIcon from '@material-ui/icons/Edit';
import { Delete } from '@material-ui/icons';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NP from 'number-precision'
import _ from 'lodash'
import { Pagination } from '@material-ui/lab';
const Wallets = () => {
    Tabtitle('Wallets')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const [pagination, setPagination] = useState([])
    const idProductRef = useRef()
    const idProductRefpage = useRef()
    const idProductRef_name = useRef()
    const [jsonResuls, setJsonResuls] = useState([])
    const [students, setStudents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [Message, setMessage] = useState(false);
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState({
      name:'',
      number:'',
    });
    const SearchText = (e) => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value,
      });
     
    };
  const pageSize = 32
useEffect(()=>{
  // if(search.name=='' && search.number==''){
  //   setMessage(true)
  // }
  Promise.all(
    [
      axios.get(`?get_wallets=&name=${search.name}&number=${search.number}&gameId=${selected?.id}`), 
      axios.get(`?get_games=&name=`),
      axios.get(`?get_transactionsAmount=`),
    ])
    .then((responses) => {
      setProduct(responses[0].data)
      setPagination(_(responses[0].data).slice(0).take(pageSize).value());
      setJsonResuls(responses[1].data)
    })
    .catch(error => console.error(error));
},[search,selected])
const pageCount = product ? Math.ceil(product.length/pageSize) :0

   setTimeout(function() {
    setMessage(false)
    }, 400);
    const handleDelete = async () => {
      await axios.post(`?delete_wallet=${idProductRef.current}`);
      var newstudent = students.filter((item) => {
       return item.id !== idProductRef.current;
      })
      setMessage(true)
      setOpen(false);
      const updatedProduct = product.filter(item => item.id !== idProductRef.current);
      setProduct(updatedProduct)
      const pagination = _(updatedProduct).slice(idProductRefpage.current).take(pageSize).value();
      setPagination(pagination);
      // getProduct(idProductRefpage.current)
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
    const numberthem = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
    });
    let number = new Intl.NumberFormat('en-US');

    const Pagechane = (event, value) =>{
      const startIndex = (value -1)*pageSize
       const pagination= _(product).slice(startIndex).take(pageSize).value()
       setPagination(pagination)
       setMessage(true)
   }
  return (
    <div>
      <NavLink to='/app/wallets/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD wallet</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container spacing={1} >
          <Grid item  lg={4} md={4} sm={6} xs={12} >
                      <Autocomplete
                            className={classes.fontText}
                            options={jsonResuls}
                            fullWidth
                            onChange={(event, value) => setSelected(value)}
                            getOptionSelected={(option, value) => option.id === value.id}
                            getOptionLabel={(jsonResuls) => jsonResuls.name}
                            renderInput={(params) => <TextField {...params} label="Game" variant="outlined" />}
                          />
          </Grid>
          <Grid item  lg={4} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Type an order number"   name='number'     
            startAdornment={<InputAdornment position="start"><SearchIcon color="action"/></InputAdornment>}
          ></OutlinedInput>
          </Grid>
          <Grid item  lg={4} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Type a wallet name"   name='name'     
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
    {pagination.map((item) => (
      <Grid item key={item.id} lg={4} md={6} sm={6} xs={12} className={classes.griditem2}>
      <Accordion  >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.colorSummary}
        >
            <Typography className={classes.textName}>{item.name}</Typography>
        </AccordionSummary>
          <div className={classes.column}/>
        <Typography variant='h5' className={classes.nenchuh52}>
          {
              jsonResuls.map((row)=>{
                if(row.id===item.gameId){
                return(<div key={row.id}>
                 Game:  {row.name}
                </div>)
              }})
          }
        </Typography>
        <Divider/> 
        <Typography variant='h5' className={classes.nenchuh52}>Remain Packages: {NP.round(item.packages, 2)}  </Typography>
          <Divider/> 
          <Typography variant='h5' className={classes.nenchuh52}>Price: {number.format(item.price)} ₫ </Typography>
          <Divider/> 
          <Typography variant='h5' className={classes.nenchuh52}>Price in dollar: {numberthem.format(item.amount)} $ </Typography>
          <Divider/> 
          <pre  className={classes.nenchuh54}>{item.notes}</pre>
          <Divider/> 
          <div className={classes.iconw}>
          <NavLink to={`/app/wallets/${item.id}`}>
          <IconButton color='primary' >
            <AddToQueueIcon/>
          </IconButton>
          </NavLink>
          <NavLink to={`/app/wallets/edit/${item.id}`}>
          <IconButton color='primary' >
            <EditIcon/>
          </IconButton>
          </NavLink>
          <IconButton color='primary' onClick={(id,page,name) => handleClickOpen(item.id,'Delete')} >
            <Delete/>
          </IconButton>
          </div>
      </Accordion>
      </Grid>
      ))} 
    </Grid>
    {product.length >10 && 
    <Grid container spacing={0} className={classes.trang} >
        <Pagination count={pageCount} onChange={Pagechane} size='small' color='primary' />
    </Grid> }
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
          Are you sure to delete this wallet?
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

export default Wallets

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
},
iconw:{
  padding:theme.spacing(1),
  justifyContent:'center',
  textAlign:'center',
},
column:{
  flexBasis: '33.33%',
},
colorSummary:{
  '&.MuiAccordionSummary-root': {
    borderRadius:'4px 4px 4px 4px',
    backgroundColor: '#3f50b5',  // thay đổi màu sắc ở đây
  },
  '&.css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded':{
    borderRadius:'4px 4px 0px 0px',
  }
},
textName:{
  fontSize: theme.typography.pxToRem(16),
    fontWeight: 500,
    justifyContent:'center',
    textAlign:'center',
    width:'100%'
},
nenchuh52:{
  fontSize: theme.typography.pxToRem(15),
  fontWeight: 500,
  padding:theme.spacing(1),
  justifyContent:'center',
  textAlign:'center',
},
nenchuh54:{
  whiteSpace:'pre-wrap',
  wordWrap:'break-word',
  textAlign:'left',
  padding:theme.spacing(1),
  marginTop:'-5px',
  fontSize: theme.typography.pxToRem(16),
},  
trang:{
  padding:theme.spacing(3),
  justifyContent:'center',
  color:'#000',
  display:'flex',
},
}));
