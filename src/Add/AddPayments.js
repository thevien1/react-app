import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from '../Api/axios';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
const AddPayments = () => {
Tabtitle('Create Payment')
let navigate = useNavigate()
  const classes = useStyles();
  const [input, setInput] = useState({
    type:'',
    currency :'',
    status:''
});
// const [status, setStatus] = React.useState('');
// const [type, setType] = React.useState('');
// const [currency, setCurrency ] = React.useState('');
  const [errorMessage, seterrorMessage] = React.useState(false);
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });

  };

  const initialValues = {
    orderNumber: '',
    owner: '',
    bank: '',
    balance: '0',
    onHoldBalance: '0',
    notes: '',
}
const validationSchema = Yup.object().shape({
	orderNumber: Yup.string().min(0, "It's too short").required("No is required"),
  owner: Yup.string().min(0,"Must be a valid email").required("Owner is required"),
  bank: Yup.string().min(0, "password must be at least 6 characters").required("Bank name is required"),
})

const onSubmit = async (values, props) => {
    let formData = new FormData();
    formData.append('type', input.type)
    formData.append('owner', values.owner)
    formData.append('balance', values.balance)
    formData.append('onHoldBalance', values.onHoldBalance)
    formData.append('notes', values.notes)
    formData.append('orderNumber', values.orderNumber)
    formData.append('bank', values.bank)
    formData.append('currency',input.currency)
    formData.append('status', input.status)
    formData.append('create_payment', 'a')
    if(input.type===''){
      input.type='1'
      return seterrorMessage('The type not found.');
    }
    if(input.status===''){
      input.status='1'
      return seterrorMessage('The status not found.');
    }
    if(input.currency===''){
      input.currency='1'
      return seterrorMessage('The currency not found.');
    }
  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
    navigate('/app/payments/')
      console.log(response)
  }).catch(function (response) {
      console.log(response)
  });
}   

  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid container item >
        <Typography className={classes.name} >Create new payment</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                            <Field as={TextField} type='number' name='orderNumber'label="Payment .No" variant="outlined" size="small"fullWidth
                                error={props.errors.orderNumber && props.touched.orderNumber}
                                helperText={<ErrorMessage name='orderNumber' />}  />
                                <Field className={classes.fontText} as={TextField} name='owner'label="Payment Owner" variant="outlined" size="small"fullWidth
                                error={props.errors.owner && props.touched.owner}
                                helperText={<ErrorMessage name='owner' />}  />
                                <Field as={TextField} name='bank'label="Bank Name" variant="outlined" size="small"fullWidth
                                error={props.errors.bank && props.touched.bank}
                                helperText={<ErrorMessage name='bank' />}  />
                                <div className={classes.fontText}></div>
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl} error={Boolean(errorMessage.length > 0 && input.type=='1' )}>
        <InputLabel>Select type</InputLabel>
        <Select value={input.type} onChange={handleChange} label="Select type" name='type'>
        <MenuItem value='Paypal' className={classes.select}>Paypal</MenuItem>
          <MenuItem value='Momo' className={classes.select}>Momo</MenuItem>
          <MenuItem value='Airpay' className={classes.select}>Airpay</MenuItem>
          <MenuItem value='Cash' className={classes.select}>Cash</MenuItem>
          <MenuItem value='BTC' className={classes.select}>BTC</MenuItem>
          <MenuItem value='BankTransfer' className={classes.select}>BankTransfer</MenuItem>
          <MenuItem value='Skrill' className={classes.select}>Skrill</MenuItem>
          <MenuItem value='TransferWise' className={classes.select}>TransferWise</MenuItem>
          <MenuItem value='WebMoney' className={classes.select}>WebMoney</MenuItem>
          <MenuItem value='PayOneer' className={classes.select}>PayOneer</MenuItem>
          <MenuItem value='PingPong' className={classes.select}>PingPong</MenuItem>
          <MenuItem value='USDT' className={classes.select}>USDT</MenuItem>
          <MenuItem value='ETH' className={classes.select}>ETH</MenuItem>
        </Select>
        {errorMessage.length > 0 && input.type=='1'  && <FormHelperText>{errorMessage}</FormHelperText>	}
      </FormControl>
      <div className={classes.fontText}></div>
      
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl} error={Boolean(errorMessage.length > 0 && input.status=='1' )}>
        <InputLabel>Select status</InputLabel>
        <Select value={input.status} onChange={handleChange} label="Select status" name='status'>
        <MenuItem value='trustSeller' className={classes.select}>Trust seller</MenuItem>
          <MenuItem value='Limit' className={classes.select}>Limit</MenuItem>
          <MenuItem value='Disable' className={classes.select}>Disable</MenuItem>
          <MenuItem value='Strong' className={classes.select}>Strong</MenuItem>
          <MenuItem value='Weak' className={classes.select}>Weak</MenuItem>
          <MenuItem value='openCase' className={classes.select}>Open case</MenuItem>
        </Select>
        {errorMessage.length > 0 && input.status=='1' && <FormHelperText>{errorMessage}</FormHelperText>	}
      </FormControl>
      <div className={classes.fontText}></div>
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl} error={Boolean(errorMessage.length > 0 && input.currency=='1' )}>
        <InputLabel>Select currency</InputLabel>
        <Select value={input.currency} onChange={handleChange} label="Select currency" name='currency'>
        <MenuItem value='VND' className={classes.select}>VND</MenuItem>
          <MenuItem value='USD' className={classes.select}>USD</MenuItem>
        </Select>
        {errorMessage.length > 0 && input.currency=='1'  && <FormHelperText>{errorMessage}</FormHelperText>	}
      </FormControl>

       <Field className={classes.fontText} type='number' as={TextField} name='balance'label="Balance" variant="outlined" size="small"fullWidth />   
       <Field as={TextField} type='number' name='onHoldBalance'label="On Hold Balance" variant="outlined" size="small"fullWidth />  
       <Field className={classes.fontText}  multiline minRows='4' as={TextField} name='notes'label="Notes" variant="outlined" size="small"fullWidth />  
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

export default AddPayments

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
    margin: theme.spacing(4 ,0),
},
}));
  