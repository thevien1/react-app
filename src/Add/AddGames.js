import { Avatar, Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
// import { Alert } from '@material-ui/lab'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from '../Api/axios';
import { useNavigate } from 'react-router-dom';
const AddUsers = () => {
Tabtitle('Create Game')
let navigate = useNavigate()
  const classes = useStyles();
  //const [errorMessage, seterrorMessage] = React.useState(false);
  const initialValues = {
    name: '',
    description: '',
}
const validationSchema = Yup.object().shape({
	name: Yup.string().min(0, "It's too short").required("Name is required"),
})

const [image, setImage] = useState()
  const [avatar,setAvatar] = useState()

  const handleFile = (e) =>{
    const file = e.target.files[0];
    setImage(file)

    file.preview = URL.createObjectURL(file)
      setAvatar(file)
  }
const onSubmit = async (values, props) => {
    let formData = new FormData();
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('avatar', image)
    formData.append('create_game', 'a')

  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
     navigate('/app/games/')
      console.log(response)
  }).catch(function (response) {
      console.log(response)
  });
}   
  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid container item >
        <Typography className={classes.name} >Create new game</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                            <Field as={TextField} name='name'label="Name" variant="outlined" size="small"fullWidth
                                error={props.errors.name && props.touched.name}
                                helperText={<ErrorMessage name='name' />}  />
       <Field  as={TextField} className={classes.fontText}  name='description'label="Description" variant="outlined" size="small"fullWidth />   
       {avatar && (
        <Avatar src={avatar.preview} variant="square"  className={classes.large}/>
        )}
                      <input accept="image/*" className={classes.input} onChange={handleFile}  id="file" name='img'multiple type="file"/>
                      <label htmlFor="file" className={classes.fontText} >
                                <Button component="span" className={classes.fontText} color="primary">
                                UPLOAD PHOTOS
                                </Button>
                            </label>
        
      {/* {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}           */}

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
  