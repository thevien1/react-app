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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CircularProgress, Grid, IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import axios from '../Api/axios';
import DoneIcon from '@material-ui/icons/Done';
import { Delete } from '@material-ui/icons';
import _ from 'lodash'
import { Pagination } from '@material-ui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
const Transactions = () => {
    Tabtitle('Transactions')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState([])
    const idProductRef = useRef()
    const idProductRefpage = useRef()
    const idProductRef_name = useRef()
    const [students, setStudents] = useState([]);
    const [Message, setMessage] = useState(false);
    const [DonePage, setDonePage] = useState('0');
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState({
      code:'',
      status:'',
    });
    const [state, setState] = React.useState({
      remain: false,
    });
    const SearchText = (e) => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value,
      });
    };
    const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };
    const pageSize = 10

    useEffect(()=>{
      if(search.name==='' && search.phone===''){
        setMessage(true)
      }
      setCurrentPage(1)
  setDonePage(0)
      Promise.all([
        axios.get(`?get_transactions=&code=${search.code}&status=${search.status}&remain=${state.remain}`),
        axios.get(`?get_clients=&name=&phoneNumber=`),
        axios.get(`?get_payments=`)
      ]).then(results => {
        const [transactions,clients,payments] = results.map(res => res.data);
        setProduct(transactions);
        setPagination(_(transactions).slice(0).take(pageSize).value());
        setClients(clients)
        setPayments(payments)
      }).catch(error => console.error(error));
    },[search,DonePage,state])
    const pageCount = product ? Math.ceil(product.length/pageSize) :0
    

   setTimeout(function() {
    setMessage(false)
    }, 200);
    const handleDelete = async () => {
      await axios.post(`?delete_transaction=${idProductRef.current}&status=${idProductRef_name.current}`);
      var newstudent = students.filter((item) => {
       return item.id !== idProductRef.current;
      })
      setStudents(newstudent);
      setMessage(true)
      setOpen(false);
  setTimeout(function() {
    Promise.all([
      axios.get(`?get_transactions=&code=${search.code}&status=${search.status}&remain=${state.remain}`),
    ]).then(results => {
      const [orders] = results.map(res => res.data);
      setProduct(orders);
      setPagination(_(orders).slice(0).take(pageSize).value());

    }).catch(error => console.error(error));
    }, 10);
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
       setCurrentPage(value)
      //  console.log(pagination)
      // getProduct(startIndex)
       setDonePage(startIndex)
   }
   let number = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });
  return (
    <div>
      <NavLink to='/app/transactions/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD transaction</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container spacing={1} >
      <Grid item  lg={4} md={4} sm={6} xs={12} >
          <FormControl className={classes.formControl} fullWidth variant="outlined" >
        <InputLabel>Transactins status</InputLabel>
        <Select value={search.status} onChange={SearchText} label="Transactins status" name='status'>
        <MenuItem value='completed' className={classes.select}>Completed</MenuItem>
        <MenuItem value='on-hold' className={classes.select}>On hold</MenuItem>
        </Select>
      </FormControl>
          </Grid>
          <Grid item  lg={4} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Search by transaction code"   name='code'     
            startAdornment={<InputAdornment position="start"><SearchIcon color="action"/></InputAdornment>}
          ></OutlinedInput>
          </Grid>
        </Grid>
        <br/>
        <FormControlLabel  name='remain' control={<Checkbox onChange={handleChange} name="remain" color='primary'/>} label="Show has remain amout only" className={classes.ckeckbox}color='primary' />
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
          <TableCell>Transaction Code</TableCell>
            <TableCell >Client</TableCell>
            <TableCell >Payment</TableCell>
            <TableCell >Amount</TableCell>
            <TableCell >Remain Amount</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Update date</TableCell>
            <TableCell >Created date</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagination.map((row) => { 
            var nullCreate = row.createdAt.split(" ");
            var dateCreate = nullCreate[0].split("-");
            var dateCreateAt= dateCreate[2]+'/'+dateCreate[1]+'/'+dateCreate[0]
           
            var nullUpdate = row.updatedAt.split(" ");
            var dateupdate = nullUpdate[0].split("-");
            var dateUpdateAt= dateupdate[2]+'/'+dateupdate[1]+'/'+dateupdate[0]

            return(
            <TableRow key={row.id}>
              <TableCell >{row.code}</TableCell>
              <TableCell >
              {clients.find(itemC => itemC.id === row.clientId)?.fullName || ''}
              </TableCell>
              <TableCell >
              {payments.find(itemP => itemP.id === row.paymentId)?.owner || ''}
              </TableCell>
              <TableCell >{number.format(row.amount)} ₫</TableCell>
              <TableCell >{number.format(row.remainAmount)} ₫</TableCell>
              <TableCell >{row.status}</TableCell>
              <TableCell >{dateCreateAt}</TableCell>
              <TableCell >{dateUpdateAt}</TableCell>
              <TableCell size='small' align="center">
              {row.status=='on-hold' &&<IconButton color="primary" onClick={(id,page,name) => handleClickOpen(row.id,DonePage,'on-hold')}>
                <DoneIcon />
                </IconButton>}
                <IconButton color="primary" onClick={(id,page,name) => handleClickOpen(row.id,DonePage,'Delete')}>
                <Delete  />
                </IconButton>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      {product.length >10 && 
    <Grid container spacing={0} className={classes.trang} >
        <Pagination count={pageCount} page={currentPage} onChange={Pagechane} size='small' color='primary' />
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

export default Transactions

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
},
formControl: {
  '& .MuiOutlinedInput-notchedOutline': {
      borderColor:'rgba(0, 0, 0, 0.23)', // thay đổi màu sắc ở đây
  },
},
}));
