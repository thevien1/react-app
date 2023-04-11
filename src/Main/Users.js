import React, { useEffect, useRef, useState } from 'react'
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress, Grid, IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import axios from '../Api/axios';
import EditIcon from '@material-ui/icons/Edit';
import { Delete } from '@material-ui/icons';
import _ from 'lodash'
import { Pagination } from '@material-ui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Users = () => {
    Tabtitle('Users')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const [pagination, setPagination] = useState([])
    const idProductRef = useRef()
    const idProductRefpage = useRef()
    const idProductRef_name = useRef()
    const [students, setStudents] = useState([]);
    const [Message, setMessage] = useState(false);
    const [DonePage, setDonePage] = useState('0');
    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState({
      name:'',
      phoneNumber:'',
    });
    const SearchText = (e) => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value,
      });
     
    };
    const pageSize = 10
    const getProduct = async (page) => {
      const data = await axios.get(`?get_users=&name=${search.name}&phoneNumber=${search.phoneNumber}`)
        setProduct(data.data);
        setPagination(_(data.data).slice(DonePage).take(pageSize).value())
  }
    useEffect(()=>{
      if(search.name==='' && search.phone===''){
        setMessage(true)
      }
        getProduct()
    },[search,DonePage])
    const pageCount = product ? Math.ceil(product.length/pageSize) :0
    

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
    const Pagechane = (event, value) =>{
      const startIndex = (value -1)*pageSize
       const pagination= _(product).slice(startIndex).take(pageSize).value()
       setPagination(pagination)
      //  console.log(pagination)
      // getProduct(startIndex)
       setDonePage(startIndex)
   }
  return (
    <div>
      <NavLink to='/app/users/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD USER</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container spacing={1} >
          <Grid item  lg={4} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Select a name"   name='name'     
            startAdornment={<InputAdornment position="start"><SearchIcon color="action"/></InputAdornment>}
          ></OutlinedInput>
          </Grid>
          <Grid item  lg={4} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Select a phone"   name='phoneNumber'     
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
      <TableContainer component={Paper}>
      <Table className={classes.table}  aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Email</TableCell>
            <TableCell >Role</TableCell>
            <TableCell >Bank Account</TableCell>
            <TableCell >Bank Name</TableCell>
            <TableCell >Phone Number</TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagination.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell >{row.email}</TableCell>
              <TableCell >{row.code}</TableCell>
              <TableCell >{row.bankAccount}</TableCell>
              <TableCell >{row.bankName}</TableCell>
              <TableCell >{row.phoneNumber}</TableCell>
              <TableCell size='small'>
              <NavLink to={`/app/users/edit/${row.id}`} >
                <IconButton color="primary" >
                <EditIcon/>
                </IconButton>
                </NavLink>
                <IconButton color="primary" onClick={(id,page,name) => handleClickOpen(row.id,DonePage,'Delete')}>
                <Delete  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {product.length >10 && 
    <Grid container spacing={0} className={classes.trang} >
        <Pagination count={pageCount} onChange={Pagechane} size='small' color='primary' />
    </Grid> }
    </TableContainer>
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

export default Users

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
table: {
    minWidth: 650,
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
trang:{
  justifyContent:'center',
  color:'#000',
  display:'flex',
},
textColor:{
  '& .MuiDialogContentText-root': {
    color:'#546e7a', // thay đổi màu sắc ở đây
},
},
center:{
  display:'flex',
  justifyContent:'center',
}
}));
