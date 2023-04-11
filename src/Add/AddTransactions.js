import { Button, Grid, Paper,Typography } from '@material-ui/core'
 import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Fields from '../Api/Fields';
import * as Yup from 'yup'
import axios from '../Api/axios';
import {FormAutocompleteClient } from '../Api/FormAutocomplete';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
const AddTransactions = () => {
Tabtitle('Create transaction')
let navigate = useNavigate()
  const classes = useStyles();
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [errorMessage, seterrorMessage] = React.useState(false);
  const [input, setInput] = useState({
    type:'',
    currency :'',
    status:''
});
  const initialValues = {
    code: '',
    amount: '',
    Payment: null,
    Client: null,
}
const validationSchema = Yup.object().shape({
  amount: Yup.number().min(0.00000001, 'Withdraw amount must be greater than zero').required('Amount is required'),
	code: Yup.string().required('Full name is required'),
    Payment: Yup.object().required('Payment is required'),
    Client: Yup.object().required('Client is required'),
})
const handleChange = (e) => {
  setInput({
    ...input,
    [e.target.name]: e.target.value,
  });

};
const getProductData = async () => {
    const client = await axios.get(`?get_clients=&name=&phoneNumber=`)
    setClients(client.data)
    const payment = await axios.get(`?get_payments=`)
    setPayments(payment.data)
}

useEffect(()=>{  
  getProductData();
},[]);

const onSubmit = async (values, props) => {
  const amount = input.currency=='VND'? values.amount:Number(values.amount)*22200
    let formData = new FormData();
    formData.append('code', values.code)
    formData.append('clientId', values.Client.id)
    formData.append('paymentId', values.Payment.id)
    formData.append('amount', amount)
    formData.append('status', input.status)
    // formData.append('balance', input.status=='completed' ? values.Payment.currency=='VND' ? Number(amount)+Number(values.Payment.balance): Number(Number(amount)/22200) +Number(values.Payment.balance): values.Payment.balance)
    // formData.append('onHoldBalance', input.status=='completed'? values.Payment.onHoldBalance : values.Payment.currency=='VND' ? Number(amount)+Number(values.Payment.onHoldBalance): Number(Number(amount)/22200) +Number(values.Payment.onHoldBalance))
    formData.append('currency', input.currency)
    formData.append('create_transaction', 'a')

    if(input.currency===''){
      input.currency='1'
      return seterrorMessage('The currency not found.');
    }
    if(input.status===''){
      input.status='1'
      return seterrorMessage('The status not found.');
    }

  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
     navigate('/app/transactions/')
      console.log(response)
  }).catch(function (response) {
      console.log(response)
  });
}   

  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid>
        <Typography className={classes.name} >Create new transaction</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched }) => (
                        <Form autoComplete="off">
                          <FormAutocompleteClient className={classes.fontText} label='Client' name="Client"  options={clients} /> 
                          <FormAutocompleteClient className={classes.fontText} label='Payment' name="Payment"  options={payments} /> 
                          <Fields name='code'className={classes.fontText} label='Full Name' errors={errors} touched={touched}variant='outlined' size='small' fullWidth />
                          <div className={classes.fontText}></div>
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl} error={Boolean(errorMessage.length > 0 && input.currency=='1' )}>
        <InputLabel>Select currency</InputLabel>
        <Select value={input.currency} onChange={handleChange} label="Select currency" name='currency'>
        <MenuItem value='VND' className={classes.select}>VND</MenuItem>
          <MenuItem value='USD' className={classes.select}>USD</MenuItem>
        </Select>
        {errorMessage.length > 0 && input.currency=='1'  && <FormHelperText>{errorMessage}</FormHelperText>	}
      </FormControl>
      <div className={classes.fontText}></div>
      <Fields name='amount'className={classes.fontText} type='number' label='Amount' errors={errors} touched={touched}variant='outlined' size='small' fullWidth />
      <div className={classes.fontText}></div>
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl} error={Boolean(errorMessage.length > 0 && input.status=='1' )}>
        <InputLabel>Transactins status</InputLabel>
        <Select value={input.status} onChange={handleChange} label="Transactins status" name='status'>
        <MenuItem value='completed' className={classes.select}>Completed</MenuItem>
          <MenuItem value='on-hold' className={classes.select}>On hold</MenuItem>
        </Select>
        {errorMessage.length > 0 && input.status=='1'  && <FormHelperText>{errorMessage}</FormHelperText>	}
      </FormControl>
      {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}          

                            <Button type='submit' className={classes.button} variant='contained'size="large" fullWidth
                                color='primary'>Create</Button>
                        </Form>
                    )}
                </Formik>
        
        </Grid>
        </Paper>
    </div>
  )
}

export default AddTransactions

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
    maxWidth: 600,
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
button:{
    margin: theme.spacing(5 ,0),
},
input: {
  display: 'none',
  color:'#3f50b5',
  margin: theme.spacing(2,0),
},
large:{
  width: theme.spacing(25),
  height: theme.spacing(25),
  margin: theme.spacing(2,0),
},
}));
  