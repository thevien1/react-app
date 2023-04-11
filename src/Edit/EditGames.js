import { Avatar, Button, Grid, Paper, TextField, Typography } from '@material-ui/core'
// import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import axios from '../Api/axios';
import { useNavigate, useParams } from 'react-router-dom';
const EditGame = () => {
Tabtitle('Update game')
let navigate = useNavigate()
  const classes = useStyles();
  const [image, setImage] = useState()
  const [avatar,setAvatar] = useState()
  //const [errorMessage, seterrorMessage] = React.useState(false);


const { id } = useParams();
const [input, setInput] = useState({
    name: ' ',
    description: ' ',
  });
const getProduct = async () =>{
    const data = await axios.get(`?get_games_id=${id}`)
    setInput(data.data);
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


  const handleFile = (e) =>{
    const file = e.target.files[0];
    setImage(file)

    file.preview = URL.createObjectURL(file)
      setAvatar(file)
  }
  const initialValues = {
    Game: null,
}

const validationSchema = Yup.object().shape({
})
const onSubmit = async (values, props) => {

    let formData = new FormData();
    formData.append('name', input.name)
    formData.append('description', input.description)
    formData.append('avatar', image)
    formData.append('id', id)
    formData.append('update_game', 'a')

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
        <Grid>
        <Typography className={classes.name} >Update game</Typography>
        <Formik  initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
<TextField onChange={handleinput}  type='text' value={input.name} name='name' error={Boolean(input.name==='' ) } helperText={input.name===''  ? 'Name is required': ''} label="Name" size="small" variant="outlined"fullWidth/> 
<TextField onChange={handleinput} className={classes.fontText}  type='text' value={input.description} name='description' label="Description" size="small" variant="outlined"fullWidth/> 
       {avatar && (
        <Avatar src={avatar.preview} variant="square"  className={classes.large}/>
        )}
        {!avatar && input.image!==''&& (<Avatar src={`/Images/${input.image}`} variant="square"  className={classes.large}/>)}
                      <input accept="image/*" className={classes.input} onChange={handleFile}  id="file" name='avatar'multiple type="file"/>
                      <label htmlFor="file" className={classes.fontText} >
                                <Button component="span" color="primary">
                                UPLOAD PHOTOS
                                </Button>
                            </label>
        
      {/* {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}           */}

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

export default EditGame

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
  