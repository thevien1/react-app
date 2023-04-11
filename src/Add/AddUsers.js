import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState } from 'react'
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
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
const AddUsers = () => {
Tabtitle('Create User')
let navigate = useNavigate()
  const classes = useStyles();
  const [input, setInput] = useState({
    role:'1' 
});
const [age, setAge] = React.useState('');
const [message, setMessage] = useState('');
  const [errorMessage, seterrorMessage] = React.useState(false);
  const [state, setState] = React.useState({
    allowZalo: '',
    allowSms: '',
  });
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setAge(e.target.value);
    setState({ ...state, [e.target.name]: e.target.checked });
  };
  const handleCheckBox = (e) => {
    setState({ ...state, [e.target.name]: e.target.checked });
  };

  const initialValues = {
    name: '',
    email: '',
    password: '',
    salary: '0',
    bonus: '0',
    bankName: '',
    bankNumber: '',
    bankAccount:'',
    zaloId: '',
    phoneNumber:'',
    maxAbsent:'',
}
const validationSchema = Yup.object().shape({
	name: Yup.string().min(0, "It's too short").required("Name is required"),
  email: Yup.string().email( "Must be a valid email").required("Email is required"),
  password: Yup.string().min(6, "password must be at least 6 characters").required("Password is required"),
})

const onSubmit = async (values, props) => {
    let formData = new FormData();
    const data = await axios.get(`?userEmail=${values.email}`)
  
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('role', age)
    formData.append('password', values.password)
    formData.append('salary', values.salary)
    formData.append('bonus', values.bonus)
    formData.append('bankName', values.bankName)
    formData.append('bankAccount', values.bankAccount)
    formData.append('zaloId', values.zaloId)
    formData.append('phoneNumber', values.phoneNumber)
    formData.append('maxAbsent', values.maxAbsent)
    formData.append('allowSms', state.allowSms)
    formData.append('allowZalo', state.allowZalo)
    formData.append('create_user', 'a')

    if(input.role==='1'){
        input.role=''
    }
    if( input.role===''){
        return seterrorMessage('The role not found.');
    }
    if(data.data.length>0){
      return setMessage(`The email already exists.` )
    }

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
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                            <Field as={TextField} name='name'label="Name" variant="outlined" size="small"fullWidth
                                error={props.errors.name && props.touched.name}
                                helperText={<ErrorMessage name='name' />}  />
                                <Field className={classes.fontText} as={TextField} name='email'label="Email Address" variant="outlined" size="small"fullWidth
                                error={props.errors.email && props.touched.email}
                                helperText={<ErrorMessage name='email' />}  />
      
      <FormControl size="small" fullWidth variant="outlined" className={classes.formControl} error={Boolean(input.role=='' )}>
        <InputLabel>Select Role</InputLabel>
        <Select value={age} onChange={handleChange} label="Select Role" name='role'>
        <MenuItem value='Admin'>Admin</MenuItem>
          <MenuItem value='Staff'>Staff</MenuItem>
          <MenuItem value='Manager'>Manager</MenuItem>
        </Select>
        {errorMessage.length > 0 && input.role=='' && <FormHelperText>Role is required</FormHelperText>	}
      </FormControl>
      <Field className={classes.fontText} type='password' as={TextField} name='password'label="Password" variant="outlined" size="small"fullWidth
                                error={props.errors.password && props.touched.password}
                                helperText={<ErrorMessage name='password' />}  />
       <Field  as={TextField} name='salary'label="Salary" variant="outlined" size="small"fullWidth />   
       <Field  className={classes.fontText} as={TextField} name='bonus'label="Bonus" variant="outlined" size="small"fullWidth />  
       <Field  as={TextField} name='bankAccount'label="Bank Account Number" variant="outlined" size="small"fullWidth />  
       <Field  className={classes.fontText} as={TextField} name='bankName'label="Bank Name" variant="outlined" size="small"fullWidth />  
       <Field  as={TextField} name='zaloId'label="Zalo Id" variant="outlined" size="small"fullWidth />  
       <Field className={classes.fontText} as={TextField} name='phoneNumber'label="Phone Number" variant="outlined" size="small"fullWidth />      
       <Field  as={TextField} name='maxAbsent'label="Max Absent" variant="outlined" size="small"fullWidth />    
       <Grid container spacing={0}  >
        <Grid item xs={6} className={classes.fontText}>
        <label className={classes.labelSwitch} >Alow Zalo:</label>
      <Switch
        name="allowZalo"
        color="primary"
        onChange={handleCheckBox} 
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
        </Grid>
        <Grid item xs={6} className={classes.fontText}>
        <label className={classes.labelSwitch} >Alow SMS:</label>
        <Switch
            name="allowSms"
            color="primary"
            onChange={handleCheckBox} 
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
  