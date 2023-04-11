import { Fab, Grid, IconButton, Paper, Switch, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as Yup from 'yup'
import axios from '../Api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
const DetailWallets = () => {
Tabtitle('Datail Wallet')
let navigate = useNavigate()
  const classes = useStyles();
  const userId = localStorage.getItem("id");
  const { id } = useParams();
  const [jsonResuls, setJsonResuls] = useState([])
  const [selectedGame, setSelectedGame] = useState({
    name:'',
    id:'',
  });
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), name: '', quantity: '',price: 0,orderNumber:'1' },
  ]);
  const [input, setInput] = useState({
    name: ' ',
    orderNumber: ' ',
    price:0,
    amount: 0,
    notes:' ',
  });
  const [state, setState] = React.useState({
    positive: false,
  });
  const formattedAmount =Number.isNaN(parseFloat(input.amount)) ? '' : Number.parseFloat(input.amount);
  const formattedPrice =Number.isNaN(parseFloat(input.price)) ? '' : Number.parseFloat(input.price);

  const [errorMessage, seterrorMessage] = React.useState(false);
  const initialValues = {
    Game: null,
}

const validationSchema = Yup.object().shape({

})

const getProductData = async () => {
    const data = await axios.get(`?get_wallets_id=${id}`)
    setInput(data.data); 
    const data1 = await axios.get(`?get_games=&name=`)
    setJsonResuls(data1.data); 
    const gameId = await axios.get(`?get_games_id=${data.data.gameId}`)  
    setSelectedGame({name:gameId.data.name,id:gameId.data.id})
    const buget = await axios.get(`?get_budgets_id=${id}`)
    setInputFields(buget.data); 
    const timeout = setTimeout(() => {
      if (data.data.deletedAt!==null){
         window.location='/error'; 
      } 
    }, 200)
}

useEffect(()=>{  
getProductData();


},[id]);

const handleinput = (e) => {
  setInput({
    ...input,
    [e.target.name]: (e.target.value),
  });
  setState({ ...state, [e.target.name]: e.target.checked });
};


const handleChangeInput = (id, event) => {
  const newInputFields = inputFields.map(i => {
    if(id === i.id) {
      i[event.target.name] = event.target.value
    }
    return i;
  })
  
  setInputFields(newInputFields);
}

const handleAddFields = () => {
  inputFields.map((item, i)=>{
      setInputFields([...inputFields, { id: uuidv4(),  name: '', quantity: '', price: '',orderNumber:i+1,status:'true'}])
    
  })
  
}

const handleRemoveFields = id => {
  const values  = [...inputFields];
  values.splice(values.findIndex(value => value.id === id), 1);
  setInputFields(values);
}

const onSubmit = async (values, props) => {
    let formData = new FormData();
    var packages = 0
    inputFields.map((item, i)=>{
      packages +=Number(item.price)*Number(item.quantity)/Number(values.price)*Number(values.amount)
    })
    let errorMessage = '';
    inputFields.forEach((item, i) => {
      if (item.name === '' || item.price === '' || item.quantity === '') {
        errorMessage = 'The data budgets invalid. Please check again';
      }
    });
    
    if(errorMessage!==''){
      return seterrorMessage(errorMessage);
    }
    formData.append('name', input.name)
    formData.append('gameId', selectedGame.id)
    formData.append('userId', userId)
    formData.append('id', id)
    formData.append('packages', packages)
    formData.append('remainPackages', 0)
    formData.append('price', input.price)
    formData.append('notes', input.notes)
    formData.append('orderNumber', input.orderNumber)
    formData.append('positive', state.positive)
    formData.append('amount', input.amount)
    formData.append('update_wallet', 'a') 
  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  })
  .then(function (response) {
     navigate('/app/wallets/')
     console.log(response)
     setTimeout(function() {
      inputFields.map((item, i)=>{
        let formData2 = new FormData();
        formData2.append('budgetName', item.name)
        formData2.append('budgetQuantity', item.quantity)
        formData2.append('budgetPrice', item.price)
        formData2.append('id', item.id)
        formData2.append('walletId', id)
        formData2.append('orderNumber', i)
        formData2.append('budgetRemainPackages', 0)
        if(item.status=='true'){
          formData2.append('status', 'true')
        }else{
          formData2.append('status', 'false')
        }
        formData2.append('update_budget_wallet', '')
        axios.post('', //Url
          formData2, 
          { headers: {'Content-Type': 'multipart/form-data' }
        })
      })
    }, 20);
  }).catch(function (response) {
      console.log(response)
  });
  
}   

  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid container item >
        <Typography className={classes.name} >Detail wallet</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                            <TextField disabled onChange={handleinput}  type='number' value={input.orderNumber} name='orderNumber' error={Boolean(input.orderNumber==='' ) } helperText={input.orderNumber===''  ? 'No is required': ''} label="No" size="small" variant="outlined"fullWidth/> 
                           {/* <FormAutocomplete className={classes.fontText} name="Game"  options={jsonResuls} />      */}
                          <Autocomplete
                            className={classes.fontText}
                            options={jsonResuls}
                            fullWidth
                            disabled
                            value={selectedGame}
                            onChange={(event, value) => setSelectedGame(value)}
                            getOptionSelected={(option, value) => option.id === value.id}
                            getOptionLabel={(jsonResuls) => jsonResuls.name}
                            size="small"
                            renderInput={(params) => <TextField {...params}  error={Boolean(selectedGame===null ) } helperText={selectedGame===null  ? 'Game is required': ''} label="Game" variant="outlined" />}
                          />
                          <TextField disabled onChange={handleinput}  type='text' value={input.name} name='name' error={Boolean(input.name==='' ) } helperText={input.name===''  ? 'Name is required': ''} label="Name" size="small" variant="outlined"fullWidth/> 
                          <TextField disabled onChange={handleinput} className={classes.fontText} type='number' value={formattedPrice} name='price' error={Boolean(input.price==='' ) } helperText={input.price===''  ? 'Price is required': ''} label="Price" size="small" variant="outlined"fullWidth/> 
                          <TextField disabled onChange={handleinput}  type='number' value={formattedAmount} name='amount' error={Boolean(input.amount==='' ) } helperText={input.amount===''  ? 'Dollar is required': ''} label="Price in Dollar" size="small" variant="outlined"fullWidth/> 
                          <label >Positive Wallet:</label>
                          <Switch
                          checked={input.positive==1 ? state.positive=true:state.positive }
                          color="primary"
                          onChange={handleinput} 
                          name="positive"            
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                          <div className={classes.fontText}></div>
                          <Typography variant='h6' className={classes.h6butget} >Budgets:</Typography>
                          {  inputFields.map((inputField,id) => (
                          <div className={classes.budget} key={inputField.id}>
   
                              <TextField disabled type='text' name='name' value={inputField.name} onChange={event => handleChangeInput(inputField.id, event)} label="Name" variant="outlined" size="small"/>
                  
                              <div className={classes.budgetMargin}>
                              <TextField disabled type='number' name='quantity' value={inputField.quantity} onChange={event => handleChangeInput(inputField.id, event)} label='Quantity'variant="outlined" size="small"/>
                              </div>
                              <TextField disabled className={clsx(classes.margin, classes.textField)} type='number' name='price' value={Number.isNaN(parseFloat(inputField.price)) ? '' : Number.parseFloat(inputField.price)} onChange={event => handleChangeInput(inputField.id, event)} label="Price"  variant="outlined"  size="small"
                                    InputProps={{
                                      endAdornment: (
                                        <div>
                                          {inputFields.length === Number(id+1) &&
                                        <Fab color="primary"aria-label="add" size="small" >
                                          <AddIcon />
                                        </Fab>}
                                        </div>
                                      ),
                                    }}
                            />
                            {inputField.status !== 'true' && <IconButton color="primary" disabled>
                            <DeleteIcon />
                            </IconButton>}
                          {inputField.status === 'true' && <IconButton color="primary"onClick={() => handleRemoveFields(inputField.id)}>
                            <DeleteIcon />
                            </IconButton>}
                        </div>  
                        )) }
                        <br/>
<TextField label="Notes" disabled  multiline minRows='4' onChange={handleinput} name='notes' value={input.notes}  className={classes.fontText}  variant="outlined" fullWidth/>
                          
      {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}          


                        </Form>
                    )}
                </Formik>
        
        </Grid>
        </Paper>
    </div>
  )
}

export default DetailWallets

const useStyles = makeStyles((theme) => ({
errortext:{
    //width:'50%',
    textAlign:'center',
    margin: theme.spacing(1,0),
},
budget:{
display:'flex',
},
textField: {
  width: '25ch',
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

button:{
    margin: theme.spacing(5 ,0),
},
budgetMargin:{
margin: theme.spacing(0,1,0,1),
},
h6butget:{
  padding:theme.spacing(0,0,1,0),
  fontWeight:500,
  fontSize:'14px',
},
}));
  