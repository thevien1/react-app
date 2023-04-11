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
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import { CircularProgress, Grid, IconButton, Typography } from '@material-ui/core';
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

const Payments = () => {
    Tabtitle('Payments')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState([])
    const idProductRef = useRef()
    const idProductRefpage = useRef()
    const idProductRef_name = useRef()
    const [Withdraw, setWithdraw] = useState([]);
    const [students, setStudents] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [Message, setMessage] = useState(false);
    const [DonePage, setDonePage] = useState('0');
    const [open, setOpen] = useState(false);

    const pageSize = 100

useEffect(()=>{
  Promise.all(
    [
      axios.get(`?get_payments=`), 
      axios.get(`?get_withdraws=`),
      axios.get(`?get_transactionsAmount=`),
    ])
    .then((responses) => {
      setProduct(responses[0].data)
      setPagination(_(responses[0].data).slice(DonePage).take(pageSize).value());
      setWithdraw(responses[1].data)
      setTransactions(responses[2].data)
    })
    .catch(error => console.error(error));
},[DonePage])
const pageCount = product ? Math.ceil(product.length/pageSize) :0
   setTimeout(function() {
    setMessage(false)
    }, 200);
    const handleDelete = async () => {

      await axios.post(`?delete_client=${idProductRef.current}`);
      var newstudent = students.filter((item) => {
       return item.id !== idProductRef.current;
      })
      setMessage(true)
      setOpen(false);
      const updatedProduct = product.filter(item => item.id !== idProductRef.current);
      setProduct(updatedProduct)
      if(updatedProduct.length==idProductRefpage.current){
        idProductRefpage.current=idProductRefpage.current-pageSize
      }
      setCurrentPage(Math.ceil(idProductRefpage.current/pageSize)+1)

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
       setCurrentPage(value)

       setDonePage(startIndex)
   }
   let balancep=0 
   let onholdp=0 
   let withdrawp=0 
   let withdrawp2=0 
   product.map((item) => {
    let balancep1 = item.currency === 'USD' ? item.balance * 22200 : item.balance;
    let onholdp1 = item.currency === 'USD' ? item.onHoldBalance * 22200 : item.onHoldBalance;
  
    balancep += Number(balancep1);
    onholdp += Number(onholdp1);
  }); 
  Withdraw.map((item)=>{
    withdrawp+=Number(item.amount)
  }) 
   let number = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });
  const numberthem = new Intl.NumberFormat('en-NZ', {
    minimumFractionDigits: 2,
  });
  return (
    <div>

      <NavLink to='/app/payments/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD PAYMENT</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container  spacing={1} >
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography color='primary' className={classes.Fomtname}>Total</Typography> </Grid>
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography color='primary'className={classes.Fomtname}>Total Balance</Typography> </Grid>
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography color='primary'className={classes.Fomtname}>Total On Hold</Typography> </Grid>
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography color='primary'className={classes.Fomtname} >Total Withdraw</Typography> </Grid>
        </Grid>
        <br/>
        <Grid container spacing={1} >
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography className={classes.Fomtname2}>{number.format(balancep+onholdp+withdrawp2+withdrawp)} ₫</Typography> </Grid>
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography className={classes.Fomtname2}>{number.format(balancep)} ₫</Typography> </Grid>
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography className={classes.Fomtname2}>{number.format(onholdp)} ₫</Typography> </Grid>
        <Grid lg={3} md={3} item sm={3} xs={3}><Typography className={classes.Fomtname2} >{number.format(withdrawp2+withdrawp)} ₫</Typography> </Grid>
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
          <TableCell>.No</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell >Type</TableCell>
            <TableCell >Bank Name</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Balance</TableCell>
            <TableCell >Monthly Balance</TableCell>
            <TableCell >On hold</TableCell>
            <TableCell >Withdraw 1</TableCell>
            <TableCell >Withdraw 2</TableCell>
            <TableCell >Notes</TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagination.map((row) => { 
            var nullCreate = row.createdAt.split(" ");
            var dateCreate = nullCreate[0].split("-");
            var dateCreateAt= dateCreate[2]+'/'+dateCreate[1]+'/'+dateCreate[0]
            const matchingWithdrawal = Withdraw.filter((item2) => row.id === item2.paymentId)[0];
            let createdAt = matchingWithdrawal ? new Date(matchingWithdrawal.createdAt) : null;
            let formattedDate = createdAt ? new Intl.DateTimeFormat('en-US', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true
            }).format(createdAt) : 'N/A';
            var myarr = formattedDate.split(",");
            var myDate = myarr[0].split("/");

            const matchingWithdrawal2 = Withdraw.filter((item2) => row.id === item2.paymentId)[1];
            let createdAt2 = matchingWithdrawal2 ? new Date(matchingWithdrawal2.createdAt) : null;
            let formattedDate2 = createdAt2 ? new Intl.DateTimeFormat('en-US', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true
            }).format(createdAt2) : 'N/A';
            var myarr2 = formattedDate2.split(",");
            var myDate2 = myarr2[0].split("/");
            return(
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.orderNumber}</TableCell>
              <TableCell >{row.owner}</TableCell>
              <TableCell >{row.type}</TableCell>
              <TableCell >{row.bank}</TableCell>
              <TableCell >{row.status}</TableCell>
              <TableCell >{row.currency=='VND'? number.format(row.balance)+` ₫` :numberthem.format((Math.round(row.balance*100)/100)).replace('.', ",")+` $`}</TableCell>
              <TableCell >{row.currency=='VND'? number.format(transactions.filter((transactionAmount) => row.id === transactionAmount.paymentId).reduce((total, item) => Number(total) + Number(item.amount), 0))+` ₫` :numberthem.format((Math.round(transactions.filter((transactionAmount) => row.id === transactionAmount.paymentId).reduce((total, item) => Number(total) + Number(item.amount), 0)/22200*100)/100)).replace('.', ",")+` $`}</TableCell>
              <TableCell >{row.currency=='VND'? number.format(row.onHoldBalance)+` ₫` :numberthem.format((Math.round(row.onHoldBalance*100)/100)).replace('.', ",")+` $`}</TableCell>
              <TableCell className={classes.notes}>
              {number.format(Withdraw.filter((item2) => row.id === item2.paymentId).slice(0)?.[0]?.amount ?? 0)==0 
              ? '' 
              : 
              number.format(Withdraw.filter((item2) => row.id === item2.paymentId).slice(0)?.[0]?.amount)
              +` ₫ \n`+myDate[1]+'/'+myDate[0]+'/'+myDate[2]+myarr[1]}
              </TableCell>
              <TableCell className={classes.notes}>
              {number.format(Withdraw.filter((item2) => row.id === item2.paymentId).slice(1)?.[0]?.amount ?? 0)==0
               ? '' 
               : number.format(Withdraw.filter((item2) => row.id === item2.paymentId).slice(1)?.[0]?.amount)
               +` ₫ \n`+myDate2[1]+'/'+myDate2[0]+'/'+myDate2[2]+myarr2[1] }
              </TableCell>
              <TableCell >{row.notes}</TableCell>
              <TableCell size='small'>
              <NavLink to={`/app/payments/${row.id}`} >
              <IconButton color='primary' >
                <AddToQueueIcon/>
              </IconButton>
              </NavLink>
              <NavLink to={`/app/payments/edit/${row.id}`} >
                <IconButton color="primary" >
                <EditIcon/>
                </IconButton>
                </NavLink>
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
        <DialogTitle id="alert-dialog-title" style={{textAlign:'center'}}>
          {"Confirmation"}
        </DialogTitle>
        <DialogContent className={classes.textColor}>
          <DialogContentText  >
          WARNING: If you delete this Payment, all transactions, orders which was created for this Payment will be deleted too, Are you sure?
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

export default Payments

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
  maxWidth:'600px',
  '& .MuiDialogContentText-root': {
    color:'#546e7a', // thay đổi màu sắc ở đây
},
},
center:{
  display:'flex',
  justifyContent:'center',
},
notes:{
  whiteSpace:'pre-wrap',
  wordWrap:'break-word',
},
Fomtname:{
    fontSize:'16px',
    fontWeight:500,
  },
  button:{
  padding:'4px 30px',
  },
  Fomtname2:{
      fontWeight:400,
  },
}));
