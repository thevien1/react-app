import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@material-ui/core/Switch';
import axios from '../Api/axios';
import { useNavigate, useParams } from 'react-router-dom';
const AddUsers = () => {
Tabtitle('Update User')
let navigate = useNavigate()
  const classes = useStyles();
  const { id } = useParams();

const [input, setInput] = useState({
  name:true,
  email:true,
  code:true,
    salary: '',
    bonus: true,
    bankName: true,
    bankNumber: true,
    bankAccount:true,
    zaloId: true,
    phoneNumber:true,
    maxAbsent:true,
    
});

const [age, setAge] = React.useState('');
const [message, setMessage] = useState('');
  const [errorMessage, seterrorMessage] = React.useState(false);
  const getProduct = async () =>{
    const data = await axios.get(`?get_users_id=${id}`)
    setInput(data.data);
    setAge(data.data.code);
}

useEffect(()=>{
  getProduct()
},[id])
  const [state, setState] = React.useState({
    allowZalo: false,
    allowSms: false,
  });

  const handleChange = (e) => {
    setAge(e.target.value);
    setState({ ...state, [e.target.name]: e.target.checked });
  };
  const [error, setError] = useState(null);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleinput = (e) => {
    if (!isValidEmail(input.email)) {
      setError('Email is invalid');
    } else {
      setError(null);
    }
    
    setInput({
      ...input,
      [e.target.name]: (e.target.value),
    });
    setState({ ...state, [e.target.name]: e.target.checked });
  };
  const initialValues = {
    password: '',
}
const validationSchema = Yup.object().shape({
  password: Yup.string().min(6, "password must be at least 6 characters"),
})

const onSubmit = async (values, props) => {
    let formData = new FormData();

    formData.append('name', input.name)
    formData.append('email', input.email)
    formData.append('code', age)
    formData.append('password', values.password)
    formData.append('salary', input.salary)
    formData.append('bonus', input.bonus)
    formData.append('bankName', input.bankName)
    formData.append('bankAccount', input.bankAccount)
    formData.append('zaloId', input.zaloId)
    formData.append('phoneNumber', input.phoneNumber)
    formData.append('maxAbsent', input.maxAbsent)
    formData.append('allowSms', state.allowSms)
    formData.append('allowZalo', state.allowZalo)
    formData.append('id', id)
    formData.append('update_user', id)
  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
    navigate('/app/users/')
      console.log(response)
  }).catch(function (response) {
      console.log(response)
  });
}   

  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid container item >
        <Typography className={classes.name} >Create new user</Typography>
        <TextField onChange={handleinput}  type='text' value={input.name} name='name' error={Boolean(input.name=='' ) } helperText={input.name==''  ? 'Name is required': ''} label="Name" size="small" variant="outlined"fullWidth/> 
        <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.email} name='email' error={Boolean(error ) } helperText={error} label="Email Address" size="small" variant="outlined"fullWidth/> 
       
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl}>
        <InputLabel>Select Role</InputLabel>
        <Select value={age} onChange={handleChange} label="Select Role" name='code'>
        <MenuItem value='Admin'>Admin</MenuItem>
          <MenuItem value='Staff'>Staff</MenuItem>
          <MenuItem value='Manager'>Manager</MenuItem>
        </Select>
      </FormControl>
      <Field className={classes.fontText} type='password' as={TextField} name='password'label="Password" variant="outlined" size="small"fullWidth
                                error={props.errors.password && props.touched.password}
                                helperText={<ErrorMessage name='password' />}  />
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.salary} name='salary' label="Salary" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.bonus} name='bonus' label="Bonus" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.bankAccount} name='bankAccount' label="Bank Account Number" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.bankName} name='bankName' label="Bank Name" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.zaloId} name='zaloId' label="Zalo Id" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.phoneNumber} name='phoneNumber' label="Phone Number" size="small" variant="outlined"fullWidth/> 
      <TextField className={classes.fontText} onChange={handleinput}  type='text' value={input.maxAbsent} name='maxAbsent' label="Max Absent" size="small" variant="outlined"fullWidth/> 
  
       <Grid container spacing={0}  >
        <Grid item xs={6} className={classes.fontText}>
        <label className={classes.labelSwitch} >Alow Zalo:</label>
      <Switch
      checked={input.allowZalo==1 ? state.allowZalo=true:state.allowZalo }
        name="allowZalo"
        color="primary"
        onChange={handleinput} 
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
        </Grid>
        <Grid item xs={6} className={classes.fontText}>
        <label className={classes.labelSwitch} >Alow SMS:</label>
        <Switch
        checked={input.allowSms==1 ? state.allowSms=true:state.allowSms }
            name="allowSms"
            color="primary"
            onChange={handleinput} 
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        </Grid>
      </Grid>   
      {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}          

      {message.length > 0 && <Alert severity="error" className={classes.errortext}>{message}</Alert>	}
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

export default AddUsers

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
  