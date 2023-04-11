import { Avatar, Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
// import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import axios from '../Api/axios';
import { useNavigate, useParams } from 'react-router-dom';
const EditClient = () => {
Tabtitle('Update client')
let navigate = useNavigate()
  const classes = useStyles();
const { id } = useParams();
const [input, setInput] = useState({
  email: ' ',
    fullName: ' ',
    faceBookName: ' ',
    phoneNumber: ' ',
    address: ' ',
  });
const getProduct = async () =>{
    const data = await axios.get(`?get_client_id=${id}`)
    setInput(data.data);
    const timeout = setTimeout(() => {
      if (data.data.deletedAt!==null){
         window.location='/error'; 
      } 
    }, 200)
}

useEffect(()=>{
  getProduct()
},[id,])
const handleinput = (e) => {
    setInput({
      ...input,
      [e.target.name]: (e.target.value),
    });
  };

const initialValues = {

}


const validationSchema = Yup.object().shape({
})
const onSubmit = async (values, props) => {
    let formData = new FormData();
    formData.append('fullName', input.fullName)
    formData.append('email', input.email)
    formData.append('faceBookName', input.faceBookName)
    formData.append('phoneNumber', input.phoneNumber)
    formData.append('address', input.address)
    formData.append('id', id)
    formData.append('update_client', 'a')
  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
     navigate('/app/clients/')
      console.log(response)
  }).catch(function (response) {
      console.log(response)
  });
}   
  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid>
        <Typography className={classes.name} >Update client</Typography>
        <Formik  initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
<TextField onChange={handleinput}  type='text' value={input.fullName} name='fullName' error={Boolean(input.fullName==='' ) } helperText={input.fullName===''  ? 'Name is required': ''} label="Name" size="small" variant="outlined"fullWidth/> 
<TextField onChange={handleinput} className={classes.fontText}  type='text' value={input.email} name='email' label="Email" size="small" variant="outlined"fullWidth/> 
<TextField onChange={handleinput} className={classes.fontText}  type='text' value={input.faceBookName} name='faceBookName' label="FaceBook Name" size="small" variant="outlined"fullWidth/> 
<TextField onChange={handleinput} className={classes.fontText}  type='text' value={input.phoneNumber} name='phoneNumber' label="Phone Number" size="small" variant="outlined"fullWidth/> 
<TextField onChange={handleinput} className={classes.fontText}  type='text' value={input.address} name='address' label="Address" size="small" variant="outlined"fullWidth/> 
                            <Button type='submit' className={classes.button}  variant='contained'size="large" fullWidth
                                color='primary'>Update</Button>
                        </Form>
                    )}
                </Formik>
        
        </Grid>
        </Paper>
    </div>
  )
}

export default EditClient

const useStyles = makeStyles((theme) => ({

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
  flexGrow: 1,
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
  