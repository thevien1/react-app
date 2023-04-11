import { Button,Divider, Grid, Paper, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import DoneIcon from '@material-ui/icons/Done';
import { CircularProgress,IconButton } from '@material-ui/core';
import axios from '../Api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from '@mui/material'
import _ from 'lodash'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const Withdraw = () => {
  Tabtitle('Payment detail')
let navigate = useNavigate()
  const classes = useStyles();
  const userId = localStorage.getItem("id");
  const [product, setProduct] = useState([])
  // const idProductRef = useRef()
  // const idProductRefpage = useRef()
  // const idProductRef_name = useRef()
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState([])
  const { id } = useParams();
  const [Message, setMessage] = useState(false);
const [input, setInput] = useState({
  balance:0,
  onHoldBalance:0,
});
  const getProduct = async () =>{
    const data = await axios.get(`?get_payment_id=${id}`)
    setInput(data.data);
}
const pageSize = 5
const getWithdraw = async () =>{
  const data = await axios.get(`?get_withdraws_id=${id}`)
  setProduct(data.data);
  setPagination(_(data.data).slice(0).take(pageSize).value())
}

const pageCount = product ? Math.ceil(product.length/pageSize) :0
    
useEffect(()=>{
  getProduct()
  getWithdraw()
},[id])


  const handleinput = (e) => {
    setInput({
      ...input,
      [e.target.name]: (e.target.value),
    });

  };
  const initialValues = {
    withdraw: '',
}
const validationSchema = Yup.object().shape({
  withdraw: Yup.number().min(0.00000001, 'Withdraw amount must be greater than zero').max(input.balance, 'Withdraw amount less than balance').required('Withdraw amount is required'),
})

const onSubmit = async (values, props) => {
    let formData = new FormData();
    if(input.currency==='VND'){
      formData.append('amount', values.withdraw)
    }else{
      formData.append('amount', Number(values.withdraw)*22200)
    }
    formData.append('userId', userId)
    formData.append('balance', Number(input.balance)-Number(values.withdraw))
    formData.append('paymentId', id)
    formData.append('create_withdraw', id)
  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
    props.resetForm()
    getProduct()
    setTimeout(function() {
      getWithdraw()
    }, 20);
    setMessage(true)
    console.log(response);
  }).catch(function (response) {
    console.log(response)
  });
}  
const SubmitWindraw = async (idToDelete,page) => {
  let formData = new FormData();
  formData.append('id', idToDelete)
  formData.append('update_withdraw', '')
axios.post('', //Url
  formData, 
  { headers: {'Content-Type': 'multipart/form-data' }
}).then(function (response) {
  setMessage(true)
  const updatedProducts = product.filter(product => product.id !== idToDelete);
  setProduct(updatedProducts);
  const updatedPageCount = Math.ceil(updatedProducts.length / pageSize);
  setCurrentPage(Math.min(currentPage, updatedPageCount));
  const startIndex = (Math.min(currentPage, updatedPageCount) - 1) * pageSize;
  const pagination = _(updatedProducts).slice(startIndex).take(pageSize).value();
  setPagination(pagination);
  
}).catch(function (response) {
  console.log(response)
});

} 
let number = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});
const numberthem = new Intl.NumberFormat('en-NZ', {
  minimumFractionDigits: 2,
});
const Pagechane = (event, value) =>{
  const startIndex = (value -1)*pageSize
   const pagination= _(product).slice(startIndex).take(pageSize).value()
   setPagination(pagination)
   setCurrentPage(value)
   setMessage(true)
  //  console.log(pagination)
  // getProduct(startIndex)
}
setTimeout(function() {
  setMessage(false)
    }, 250);
  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid>
        <Typography className={classes.name} >Payment detail</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                          <Grid container spacing={1}>
                          <Grid  >
                          <Typography className={classes.balanceName} color='primary'>Balance:</Typography>
                          </Grid>
                          <Grid >
                          {input.currency=='USD' &&   
                          <Typography className={classes.balanceNumber}>{numberthem.format((Math.round(input.balance*100)/100)).replace('.', ",")} $</Typography>
                          }
                          {input.currency=='VND' &&   
                          <Typography className={classes.balanceNumber}>{number.format(input.balance)} ₫</Typography>
                          }
                          </Grid>
                          </Grid>
                          <Grid container spacing={1}>
                          <Grid  >
                          <Typography className={classes.balanceName} color='primary'>On Hold Balance:</Typography>
                          </Grid>
                          <Grid >
                          {input.currency=='USD' &&   
                          <Typography className={classes.balanceNumber}>{numberthem.format((Math.round(input.onHoldBalance*100)/100)).replace('.', ",")} $</Typography>
                          }
                          {input.currency=='VND' &&   
                          <Typography className={classes.balanceNumber}>{number.format(input.onHoldBalance)} ₫</Typography>
                          }
                          </Grid>
                          </Grid>
                          <Grid container spacing={1}>
                          <Grid  >
                          <Typography className={classes.balanceName} color='primary'>Total Balance:</Typography>
                          </Grid>
                          <Grid >
                          {input.currency=='USD' &&   
                          <Typography className={classes.balanceNumber}>{numberthem.format((Math.round((Number(input.balance)+Number(input.onHoldBalance))*100)/100)).replace('.', ",")} $</Typography>
                          }
                          {input.currency=='VND' &&   
                          <Typography className={classes.balanceNumber}>{number.format((Number(input.balance)+Number(input.onHoldBalance)))} ₫</Typography>
                          }
                          </Grid>
                          </Grid>
                          <br/>
                          <Grid container spacing={1}>
                          <Field as={TextField} disabled={Number(input.balance)===0  ? true:''} name='withdraw'type='number' size="small"  label='Withdraw amount'  variant="outlined"
                                error={props.errors.withdraw && props.touched.withdraw}
                                helperText={<ErrorMessage name='withdraw' />}  />
                          </Grid>
                            <Button disabled={Number(input.balance)===0 ? true:''} type='submit' className={classes.button} variant='contained'size="large" 
                                color='primary'>Withdraw</Button>
                        </Form>
                    )}
                </Formik>
                {Message && 
      <CircularProgress />
    }
        </Grid>
        </Paper>
        <br/><br/>
{product.length>0 && <div>
    <Divider style={{backgroundColor:'#000'}}/>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell >Withdrawn By</TableCell>
            <TableCell >Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {pagination.map((item)=>{
           var nullCreate = item.createdAt.split(" ");
           var dateCreate = nullCreate[0].split("-");
           var dateCreateAt= dateCreate[2]+'/'+dateCreate[1]+'/'+dateCreate[0]
      return(
            <TableRow hover >
              <TableCell component="th" scope="row">{dateCreateAt}</TableCell>
              <TableCell >{number.format(item.amount)} ₫</TableCell>
              <TableCell >{item.id}</TableCell>
              <TableCell >In progress</TableCell>
              <TableCell align="center"  size='small'>
                <IconButton color='primary' onClick={()=> SubmitWindraw(item.id,currentPage)}>
                <DoneIcon/>
                </IconButton>
              </TableCell>
            </TableRow>  
 )
})}
        </TableBody>     
      </Table>
      {product.length >5 && 
    <Grid container spacing={0} className={classes.trang} >
        <Pagination count={pageCount} page={currentPage} onChange={Pagechane} size='small' color='primary' />
    </Grid> }
    </TableContainer>
    </div>}
    </div>
  )
}

export default Withdraw

const useStyles = makeStyles((theme) => ({
errortext:{
    //width:'50%',
    textAlign:'center',
    margin: theme.spacing(1,0),
},
fontText:{
    margin:theme.spacing(1,0),
},
paper: {
    maxWidth: 300,
    margin: `auto`,
    backgroundColor:`#fafafa`,
},
select:{
    fontWeight:405,
    color: 'rgba(0, 0, 0, 0.59)',
    },
name:{
    fontWeight:500,
    fontSize:'30px',
    margin: theme.spacing(0,0,3,0),
},
formControl: {
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor:'rgba(0, 0, 0, 0.23)', // thay đổi màu sắc ở đây
    },
},
trang:{
  justifyContent:'center',
  color:'#000',
  display:'flex',
},
button:{
    margin: theme.spacing(4 ,0),
},
balanceName:{
  fontWeight:500,
    fontSize:'16px',
    margin: theme.spacing(1,0),
    textAlign:'center',
},
balanceNumber:{
  fontWeight:400,
  fontSize:'16px',
  margin: theme.spacing(1,3),
  textAlign:'center',
},
}));
  