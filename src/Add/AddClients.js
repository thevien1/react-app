import { Avatar, Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../Api/axios';
import { useNavigate } from 'react-router-dom';

const AddClients = () => {
  Tabtitle('Create Client');
  let navigate = useNavigate();
  const classes = useStyles();

  const initialValues = {
    fullName: '',
    faceBookName: '',
    email:'',
    phoneNumber:'',
    address:'',
  }

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().min(0, "It's too short").required("Name is required"),
  });

  const onSubmit = async (values, props) => {
    let formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('faceBookName', values.faceBookName);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('email', values.email);
    formData.append('address', values.address);
    formData.append('create_client', 'a');

    axios.post(
      '', // URL
      formData, 
      { headers: {'Content-Type': 'multipart/form-data' }}
    )
    .then(function (response) {
      navigate('/app/clients/');
      console.log(response);
    })
    .catch(function (response) {
      console.log(response);
    });
  }   

  return (
    <div>
      <Paper className={classes.paper} elevation={0}>
        <Grid>
          <Typography className={classes.name}>Create new client</Typography>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {(props) => (
              <Form autoComplete="off">
                <Field as={TextField} name='fullName'label="Name" variant="outlined" size="small"fullWidth
                  error={props.errors.fullName && props.touched.fullName}
                  helperText={<ErrorMessage name='fullName' />}
                />
                <Field  as={TextField}  name='email'label="Email" variant="outlined" size="small"fullWidth />   
                <Field  as={TextField} className={classes.fontText}  name='faceBookName'label="FaceBook Name" variant="outlined" size="small"fullWidth />  
                <Field  as={TextField}   name='phoneNumber'label="Phone Number" variant="outlined" size="small"fullWidth />  
                <Field  as={TextField} className={classes.fontText}  name='address'label="Address" variant="outlined" size="small"fullWidth />  

                <Button type='submit' className={classes.button} variant='contained'size="large" fullWidth color='primary'>Create</Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Paper>
    </div>
  );
}

export default AddClients;

const useStyles = makeStyles((theme) => ({
  fontText:{
    margin:theme.spacing(1,0),
  },
  paper: {
    maxWidth: 600,
    margin: `auto`,
    backgroundColor:`#fafafa`,
  },
  name:{
    fontWeight:500,
    fontSize:'30px',
    margin: theme.spacing(0,0,3,0),
  },
  button:{
    margin: theme.spacing(5 ,0),
  },
}));
