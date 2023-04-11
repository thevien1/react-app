import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form} from 'formik'
import * as Yup from 'yup'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from '../Api/axios';
import { useNavigate, useParams } from 'react-router-dom';
const AddPayments = () => {
Tabtitle('Update Payment')
let navigate = useNavigate()
  const classes = useStyles();
  const { id } = useParams();

const [input, setInput] = useState({
  orderNumber: ' ',
  owner: ' ',
  bank: ' ',
  balance: ' ',
  onHoldBalance: ' ',
  notes: ' ',
  type: ' ', 
  status: ' ', 
  currency: ' ', 
  balance: 0, 
  onHoldBalance: 0, 
});
  const getProduct = async () =>{
    const data = await axios.get(`?get_payment_id=${id}`)
    setInput(data.data);
}

useEffect(()=>{
  getProduct()
},[id])
  const [state, setState] = React.useState({
    allowZalo: false,
    allowSms: false,
  });

  const handleinput = (e) => {
    setInput({
      ...input,
      [e.target.name]: (e.target.value),
    });

  };
  const initialValues = {
    password: '',
}
const validationSchema = Yup.object().shape({

})

const onSubmit = async (values, props) => {
    let formData = new FormData();
    formData.append('type', input.type)
    formData.append('owner', input.owner)
    formData.append('balance', input.balance)
    formData.append('onHoldBalance', input.onHoldBalance)
    formData.append('notes', input.notes)
    formData.append('orderNumber', input.orderNumber)
    formData.append('bank', input.bank)
    formData.append('currency',input.currency)
    formData.append('status', input.status)

    formData.append('id', id)
    formData.append('update_payment', id)
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
        <Typography className={classes.name} >Update payment</Typography>
        <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.orderNumber} name='orderNumber' error={Boolean(input.orderNumber=='' ) } helperText={input.orderNumber==''  ? 'Payment .No is required': ''} label="Payment .No" size="small" variant="outlined"fullWidth/> 
        <TextField  onChange={handleinput}  type='text' value={input.owner} name='owner' label="Payment Owner" size="small" variant="outlined"fullWidth/> 
        <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.bank} name='bank' label="Bank Name" size="small" variant="outlined"fullWidth/> 
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl}>
        <InputLabel>Select type</InputLabel>
        <Select value={input.type} onChange={handleinput} label="Select type" name='type'>
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
      </FormControl>
      <div className={classes.fontText}></div>
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl}>
        <InputLabel>Select status</InputLabel>
        <Select value={input.status} onChange={handleinput} label="Select status" name='status'>
        <MenuItem value='trustSeller' className={classes.select}>Trust seller</MenuItem>
          <MenuItem value='limit' className={classes.select}>Limit</MenuItem>
          <MenuItem value='disable' className={classes.select}>Disable</MenuItem>
          <MenuItem value='strong' className={classes.select}>Strong</MenuItem>
          <MenuItem value='weak' className={classes.select}>Weak</MenuItem>
          <MenuItem value='openCase' className={classes.select}>Open case</MenuItem>
        </Select>
      </FormControl>
      <div className={classes.fontText}></div>
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl}>
        <InputLabel>Select currency</InputLabel>
        <Select value={input.currency} onChange={handleinput} label="Select currency" name='currency'>
        <MenuItem value='VND' className={classes.select}>VND</MenuItem>
          <MenuItem value='USD' className={classes.select}>USD</MenuItem>
        </Select>
      </FormControl>
      <TextField className={classes.fontText} type='number' onChange={handleinput} value={input.balance} name='balance' label="Balance" size="small" variant="outlined"fullWidth/> 
      <TextField type='number' onChange={handleinput} value={input.onHoldBalance} name='onHoldBalance' label="On Hold Balance" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} multiline minRows='4'type='number' onChange={handleinput} value={input.notes} name='notes' label="Notes" size="small" variant="outlined"fullWidth/> 
                            <Button type='submit' className={classes.button} variant='contained'size="large" fullWidth
                                color='primary'>Update</Button>
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
  