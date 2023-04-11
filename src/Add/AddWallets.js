import { Button, Fab, Grid, IconButton, Paper, Switch, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as Yup from 'yup'
import axios from '../Api/axios';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
const AddWallets = () => {
Tabtitle('Create Wallet')
let navigate = useNavigate()
  const classes = useStyles();
  const userId = localStorage.getItem("id");
  const [selected, setSelected] = useState([]);

  const [jsonResuls, setJsonResuls] = useState([])
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), name: '', quantity: '',price: '',orderNumber:'1' },
  ]);
  const [update, setUpdate] = useState({
    positive:false,
    notes:'',
  });
  const [errorMessage, seterrorMessage] = React.useState(false);
  const initialValues = {
    name: '',
    no: '',
    price:'',
    amount:'',
    Game: null,
}

const validationSchema = Yup.object().shape({
  no: Yup.string().min(0, "It's too short").required("No is required"),
	name: Yup.string().min(0, "It's too short").required("Wallet name is required"),
  price: Yup.string().min(0, "It's too short").required("Price is required"),
  amount: Yup.string().min(0, "It's too short").required("Doller is required"),
  Game: Yup.object().required('Game is required'),
})

const getProductData = async () => {
  try{
    const data = await axios.get(`?get_games=&name=`)
    setJsonResuls(data.data);     
  }
  catch(e){
  }
}

useEffect(()=>{  
getProductData();
},[]);

const handleChange = (e) => {
  setUpdate({
    ...update,
    [e.target.name]: {
      checked: e.target.checked,
      value: e.target.value
    }
  });
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
      setInputFields([...inputFields, { id: uuidv4(),  name: '', quantity: '', price: '',orderNumber:i+1}])
    
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
      packages +=Number(item.price)*Number(item.quantity)/Number(values.price)
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
    formData.append('name', values.name)
    formData.append('gameId', selected.id)
    formData.append('userId', userId)
    formData.append('packages', packages)
    formData.append('remainPackages', 0)
    formData.append('price', values.price)
    formData.append('notes', update.notes.value)
    formData.append('orderNumber', values.no)
    formData.append('positive', update.positive.checked)
    formData.append('amount', values.amount)
    formData.append('create_wallet', 'a') 
  axios.post('', //Url
    formData, 
    { headers: {'Content-Type': 'multipart/form-data' }
  }).then(function (response) {
     navigate('/app/wallets/')
     console.log(response)
     setTimeout(function() {
      inputFields.map((item, i)=>{
        let formData2 = new FormData();
        formData2.append('budgetName', item.name)
        formData2.append('budgetQuantity', item.quantity)
        formData2.append('budgetPrice', item.price)
        formData2.append('orderNumber', i)
        formData2.append('budgetRemainPackages', 0)
        formData2.append('create_budget_wallet', '')
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
const AutocompleteField = ({ options, name, onChange, onBlur, value, error, helperText, getOptionSelected, getOptionLabel, ...rest }) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField {...params} label={name} variant="outlined" size="small" fullWidth error={error} helperText={helperText} />
      )}
      {...rest}
    />
  );
};

const FormAutocomplete = ({ name, options, ...rest }) => {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const { errors, touched, setFieldValue, setFieldTouched } = form;
        const { value } = field;
        const handleChangeSelect = (event, value) => {
          setFieldValue(name, value);
          setSelected(value)
        };
        const handleBlur = () => {
          setFieldTouched(name, true);
        };
        const error = errors[name] && touched[name];
        const helperText = <ErrorMessage name={name} />;

        return (
          <AutocompleteField
            options={options}
            name={name}
            value={value}
            onChange={handleChangeSelect}
            onBlur={handleBlur}
            error={error}
            helperText={helperText}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            {...rest}
          />
        );
      }}
    </Field>
  );
};
  return (
    <div>
        <Paper className={classes.paper} elevation={0}>
        <Grid container item >
        <Typography className={classes.name} >Create new wallet</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                            <Field as={TextField} type='number' name='no'label="No" variant="outlined" size="small"fullWidth
                                error={props.errors.no && props.touched.no}
                                helperText={<ErrorMessage name='no' />}  />
                           <FormAutocomplete className={classes.fontText} name="Game"  options={jsonResuls} />     
                          {/* <Autocomplete
                            className={classes.fontText}
                            options={jsonResuls}
                            fullWidth
                            onChange={(event, value) => setSelected(value)}
                            getOptionSelected={(option, value) => option.id === value.id}
                            getOptionLabel={(jsonResuls) => jsonResuls.name}
                            size="small"
                            renderInput={(params) => <TextField {...params} label="Game" variant="outlined" />}
                          /> */}
                          <Field  as={TextField} name='name'label="Name" variant="outlined" size="small"fullWidth
                                error={props.errors.name && props.touched.name}
                                helperText={<ErrorMessage name='name' />}  />
                          <Field className={classes.fontText} as={TextField} type='number' name='price'label="Price" variant="outlined" size="small"fullWidth
                                error={props.errors.price && props.touched.price}
                                helperText={<ErrorMessage name='price' />}  />
                            <Field  as={TextField} type='number' name='amount'label="Price in Dollar" variant="outlined" size="small"fullWidth
                                error={props.errors.amount && props.touched.amount}
                                helperText={<ErrorMessage name='amount' />}  />
                          <label>Positive Wallet:</label>
                          <Switch
                            name="positive"
                            color="primary"
                            onChange={handleChange} 
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                          <div className={classes.fontText}></div>
                          <Typography variant='h6' className={classes.h6butget} >Budgets:</Typography>
                          {  inputFields.map((inputField,id) => (
                          <div className={classes.budget} key={inputField.id}>
   
                              <TextField type='text' name='name' value={inputField.name} onChange={event => handleChangeInput(inputField.id, event)} label="Name" variant="outlined" size="small"/>
                  
                              <div className={classes.budgetMargin}>
                              <TextField type='number' name='quantity' value={inputField.quantity} onChange={event => handleChangeInput(inputField.id, event)} label='Quantity'variant="outlined" size="small"/>
                              </div>
                              <TextField className={clsx(classes.margin, classes.textField)} type='number' name='price' value={inputField.price} onChange={event => handleChangeInput(inputField.id, event)} label="Price"  variant="outlined"  size="small"
                                    InputProps={{
                                      endAdornment: (
                                        <div>
                                          {inputFields.length === Number(id+1) &&
                                        <Fab color="primary"aria-label="add" size="small" onClick={handleAddFields}>
                                          <AddIcon />
                                        </Fab>}
                                        </div>
                                      ),
                                    }}
                            />
                          {inputFields.length !== 1 && <IconButton color="primary"onClick={() => handleRemoveFields(inputField.id)}>
                            <DeleteIcon />
                            </IconButton>}
                        </div>  
                        )) }
<TextField label="Notes"  multiline minRows='4' onChange={handleChange} name='notes' className={classes.fontText}  variant="outlined" fullWidth/>
                          
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

export default AddWallets

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
  