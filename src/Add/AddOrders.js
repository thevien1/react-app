import { Button, Paper, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { FormAutocomplete,FormAutocompleteClient } from '../Api/FormAutocomplete';
import * as Yup from 'yup'
import axios from '../Api/axios';
import Big from 'big.js';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
const AddOrders = () => {
Tabtitle('Create order')
let navigate = useNavigate()
  const classes = useStyles();
  const userId = localStorage.getItem("id");
  const [errorMessage, seterrorMessage] = React.useState(false);
  const [salePrice, setSalePrice] = useState('')
  const [fieldValueGame, setFieldValueGame] = useState([])
  const [fieldValueWallet, setFieldValueWallet] = useState([])
  const [fieldValueClient, setFieldValueClient] = useState([])
  const [fieldValueTransaction, setFieldValueTransaction] = useState([])
  const [jsonResuls, setJsonResuls] = useState([])
  const [jsonWallets, setJsonWallets] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [avatar,setAvatar] = useState([])
  const [jsonBudgets, setJsonBudgets] = useState([])
  const [jsonClients, setJsonClients] = useState([])
  const [jsonTransactions, setJsonTransactions] = useState([])
  const [inputWallet, setInputWallet] = useState([]);
  const [inputBuget, setInputBudget] = useState([]);
  // console.log(fieldValueTransaction)

  const getProductData = async () => {
    const data = await axios.get(`?get_games=&name=`)
    setJsonResuls(data.data);     
    const wallet = await axios.get(`?get_walles_gameId=${fieldValueGame.id}`)
    setJsonWallets(wallet.data)
    const ids = fieldValueWallet.map(row => row.id).join(',');
    if(fieldValueWallet.length>0){
      const budget = await axios.get(`?get_budgets_walletId=${ids}`);
      setJsonBudgets(budget.data);
    }
    const client = await axios.get(`?get_clients=&name=&phoneNumber=`)
    setJsonClients(client.data) 

}

const getProductDataclient = async () => {
  const transaction = await axios.get(`?get_transactions_clienId=${fieldValueClient.id}`);
  setJsonTransactions(transaction.data);
}
useEffect(()=>{  
getProductData();
},[fieldValueGame,fieldValueWallet]);

useEffect(()=>{  
  getProductDataclient();
  },[fieldValueClient]);
const initialValues = {
salePrice: '',
Game: null,
Client: null,
information:'Login:\nAccount:\nPass:\nServer:\nCharacter Name:',
notes:'',
bonus:'',
}


const validationSchema = Yup.object().shape({
  salePrice: Yup.number().required("Sale price is required"),
  Game: Yup.object().required('Game is required'),
  Client: Yup.object().required('Client is required'),
 
})


let basePrice = 0
fieldValueWallet.map((item)=>{
  if(item.quantity){
    item.quantity=item.quantity
  }else{
    item.quantity=0
  }
  basePrice +=Number(item.quantity)*Number(item.price)
})

const handleChangeInputWallet = (id,priceWallet,positive,amount, event) => {
  const newInputFields = fieldValueWallet.map(w => {
    if(id === w.id) {
      w[event.target.name] = event.target.value

    }
    return w;
  })
  setInputWallet(newInputFields);
  let enterTheQuantity =event.target.value;
    if (enterTheQuantity === '') {
      enterTheQuantity = 0;
    }
    enterTheQuantity = parseFloat(enterTheQuantity);

    if (!isNaN(enterTheQuantity) && positive==0) {
      // filter the rows by quantity
      const filteredRows = jsonBudgets.filter((row) => row.quantity != 0);
      // sort the filtered rows by price from low to high
      const sortedRows = filteredRows.sort((a, b) => Number(a.price) - Number(b.price));

      const updatedRows = sortedRows.map((item, index) => {
        if(item.walletId===id){
        const { quantity, price } = item;
        const remainQuantity = Number(quantity) * Number(price) / (Number(priceWallet));

        // Calculate the used quantity based on the entered quantity and the remaining quantity
        let usedQuantity = 0;
        if (enterTheQuantity >= remainQuantity) {
          usedQuantity = Number(quantity);
          enterTheQuantity -= remainQuantity;
        } else if (enterTheQuantity > 0) {
          usedQuantity = Number(enterTheQuantity * priceWallet / Number(price));
          enterTheQuantity = 0;
        }
        let formData = new FormData();
        formData.append('id', item.id)
        formData.append('usedQuantity', usedQuantity)
        formData.append('update_budget_usedQuantity', 'a')
      axios.post('', //Url
        formData, 
        { headers: {'Content-Type': 'multipart/form-data' }
      })
        return { ...item, usedQuantity, remainQuantity };
        }else {
          return item;
        }
      });

      setJsonBudgets(updatedRows);
      setInputBudget(updatedRows)
    }
    if (!isNaN(enterTheQuantity) && positive==1) {
      const maxPrice = jsonBudgets.reduce((min, row) => {
        if (row.walletId === id) {
          const price = parseInt(row.price);
          return price < min.price ? { price, id: row.id } : min;
        }
        return min;
      }, { price: Infinity, id: null });
      
      const updatedRows = jsonBudgets.map((item) => {
        if(item.id==maxPrice.id){
          item.usedQuantity = Number(enterTheQuantity) * Number(item.price) / Number(priceWallet)*Number(amount);
          let formData = new FormData();
        formData.append('id', item.id)
        formData.append('usedQuantity', Number(enterTheQuantity) * Number(item.price) / Number(priceWallet)*Number(amount))
        formData.append('update_budget_usedQuantity', 'a')
      axios.post('', //Url
        formData, 
        { headers: {'Content-Type': 'multipart/form-data' }
      })
        }
        return item
      });
      setJsonBudgets(updatedRows);
      setInputBudget(updatedRows)
    }
}

const handleChangeInputBudget = (id, event) => {

  const newjsonBudgets = jsonBudgets.map(w => {
    if(id === w.id) {
      
      w[event.target.name] = event.target.value
      let formData = new FormData();
        formData.append('id', id)
        formData.append('usedQuantity', event.target.value)
        formData.append('update_budget_usedQuantity', 'a')
      axios.post('', //Url
        formData, 
        { headers: {'Content-Type': 'multipart/form-data' }
      })
    }
    return w;
  })
  setInputBudget(newjsonBudgets);
}

if(!fieldValueGame){
  setTimeout(function() {
    setFieldValueWallet([])
}, 2);
}

const setChangeWallet = async (value) =>{
  value.map((item)=>{ 
    if(item.quantity==null){
      let formData = new FormData();
      formData.append('id', item.id)
      formData.append('walletId', item.id)
      formData.append('usedQuantity', 0)
      formData.append('update_budget_usedQuantity', 'a')
    axios.post('', //Url
      formData, 
      { headers: {'Content-Type': 'multipart/form-data' }
    })
    }
  })

}
const setChangeTransaction = async (values,a) =>{
  const sortedValues = values.sort((a, b) => a.remainAmount-b.remainAmount);
  let remainQuantity = 0;
    let updatedRows = sortedValues.map((item, index) => {
      let usedAmount = 0;
      if (index === 0) {
        // id1: usedAmount=salePrice-item.remainAmount
        usedAmount = salePrice - item.remainAmount;
        if(usedAmount>0){
          usedAmount = item.remainAmount;
          remainQuantity = salePrice - item.remainAmount;
        }else{
          usedAmount =salePrice;
          remainQuantity = 0;
        }
        
      } else {
        // id2 & id3: usedAmount=usedAmount(cũ)-item.remainAmount
        if(remainQuantity>=item.remainAmount){ 
          usedAmount = item.remainAmount;
          remainQuantity = remainQuantity - item.remainAmount;
        }else if(remainQuantity<item.remainAmount && remainQuantity>0){
          usedAmount = remainQuantity;
          remainQuantity = 0;
        }else{
          usedAmount = 0;
          remainQuantity = 0;
        }
      }

      return { ...item, usedAmount };
    });
  setFieldValueTransaction(updatedRows);
}

const ChangeSalePrice = async (values) =>{
  const salePrice = values
  if(salePrice!==''){
  const sortedValues = fieldValueTransaction.sort((a, b) => a.remainAmount-b.remainAmount);
  let remainQuantity = 0;
    let updatedRows = sortedValues.map((item, index) => {
      let usedAmount = 0;
      if (index === 0) {
        // id1: usedAmount=salePrice-item.remainAmount
        usedAmount = salePrice - item.remainAmount;
        if(usedAmount>0){
          usedAmount = item.remainAmount;
          remainQuantity = salePrice - item.remainAmount;
        }else{
          usedAmount =salePrice;
          remainQuantity = 0;
        }
        
      } else {
        // id2 & id3: usedAmount=usedAmount(cũ)-item.remainAmount
        if(remainQuantity>=item.remainAmount){ 
          usedAmount = item.remainAmount;
          remainQuantity = remainQuantity - item.remainAmount;
        }else if(remainQuantity<item.remainAmount && remainQuantity>0){
          usedAmount = remainQuantity;
          remainQuantity = 0;
        }else{
          usedAmount = 0;
          remainQuantity = 0;
        }
      }

      return { ...item, usedAmount };
    });
    setFieldValueTransaction(updatedRows);
  }
  if(salePrice==''){
      setFieldValueTransaction([]);
    }
  setSalePrice(values)
}

const viewAvatar = (e) => {
  const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
  setSelectedFiles((prevImages) => prevImages.concat(filesArray));
  Array.from(e.target.files).map(
    (file) => URL.revokeObjectURL(file) // avoid memory leak
  );

  for (let i=0; i<e.target.files.length; i++){
    const file = e.target.files[i];
      setAvatar((prevState) => [...prevState, file]);
  }
}

const renderPhotos = (source) => {
  return source.map((photo) => {
    return <img src={photo} alt="" className={classes.photoimg} key={photo} />;
  });
};

var totalUsedAmount = 0;
var totalRemainAmount = 0;

fieldValueTransaction.map((item)=>{
  totalUsedAmount += Number(item.usedAmount)
  totalRemainAmount += Number(item.remainAmount)
})
const onSubmit = async (values, props) => {
  const budgetsorders = jsonBudgets.map(row => `${row.id}/${row.usedQuantity}/${row.quantity}/${row.walletId}/${row.price}`).join(',');
  const walletsIds = fieldValueWallet.map(row => `${row.id}/${row.positive}/${row.packages}/${row.price}`).join(',');
  const transactionOders = fieldValueTransaction.map(row => `${row.id}/${row.usedAmount}/${row.remainAmount}`).join(',');

  let totalBudget = 0
  fieldValueWallet.map((itemA)=>{
  jsonBudgets.map((item)=>{
    if(itemA.id==item.walletId && itemA.positive==1){
      totalBudget += Number(item.usedQuantity) * Number(item.price)/Number(itemA.amount)
    }
    if(itemA.id==item.walletId && itemA.positive==0){
      totalBudget += Number(item.usedQuantity) * Number(item.price)
    }
  })
})
  let errorMessage = '';
  fieldValueWallet.map((item)=>{
    if(item.quantity==='0' || item.quantity===0){
      errorMessage='The selected Budgets are not map with the base price of products, please review again!!!.';
    }
  })

  if (salePrice < basePrice) {
    errorMessage='Please review the Sale Price, it is less than the total wallet packages you just entered.';
  } else if (Math.round(basePrice) !== Math.round(totalBudget)) {

    errorMessage='The selected budgets do not match the base price of products, please review again!!.';
  } else if (totalBudget === 0) {
    errorMessage='The budget quantity is required.';
  }

  if(errorMessage!==''){
    return seterrorMessage(errorMessage);
  }


var paymentStatus = ''
if(totalRemainAmount==0){
  paymentStatus='unPaid'
}else if(salePrice<=totalRemainAmount){
  paymentStatus='paid'
}else{
  paymentStatus='partPaid'
}
setTimeout(function() {
let formData = new FormData();
  formData.append('clientId', fieldValueClient.id)
  formData.append('gameId', fieldValueGame.id)
  formData.append('userId', userId)
  formData.append('basePrice', basePrice)
  formData.append('salePrice', salePrice)
  formData.append('paidAmount', totalUsedAmount)
  formData.append('bonusAmount', values.bonus)
  formData.append('paymentStatus', paymentStatus)
  formData.append('status', 'inProgress')
  formData.append('info', values.information)
  formData.append('notes', values.notes)
  formData.append('budgetsorders', budgetsorders)
  formData.append('walletsIds', walletsIds)
  formData.append('transactionOders', transactionOders)

  formData.append('create_order', '')
axios.post('', //Url
  formData, 
  { headers: {'Content-Type': 'multipart/form-data' }
}).then(function (response) {
  setTimeout(function() {
   navigate('/app/orders/')
  }, 110);
 console.log(response)
}).catch(function (response) {
    console.log(response)
});
}, 10);
setTimeout(function() {
  avatar.sort((a, b) => a.size - b.size).map((image, i) =>{

    let formData6 = new FormData();
    formData6.append('avatar', image)
    formData6.append('orderNumber', i)
    formData6.append('create_orderphotos', '')
  axios.post('', //Url
  formData6, 
  { headers: {'Content-Type': 'multipart/form-data' }
})
  })
}, 100);
}

let number = new Intl.NumberFormat('en-US');
  return (
    <div>
        <Paper className={classes.paper} elevation={0}>

        <Typography className={classes.name} >Create new order</Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form autoComplete="off">
                           <FormAutocomplete onChangeSelect={(value) => setFieldValueGame(value)} className={classes.fontText} label='Game' name="Game"  options={jsonResuls} /> 
              {fieldValueGame && fieldValueGame.length!=0 && 
              <FormAutocomplete placeholder="Select one or multiple"onChange={(event, values) => {setFieldValueWallet(values);setChangeWallet(values)}} multiple={true} filterSelectedOptions={true}className={classes.fontText} name="Wallet" label='Wallet'  options={jsonWallets} /> 
              }   
                           
                          { fieldValueGame && fieldValueGame.length!=0 && fieldValueWallet.map((item)=>{
                            return(
                            <div key={item.id}>
                            <div className={classes.budget}/>
                            <div className={classes.budget}/>
                            <div className={classes.budget}>
                              <Typography className={classes.nameW}>Wallet name: {item.name}</Typography>
                              <TextField onChange={event =>handleChangeInputWallet(item.id,item.price,item.positive,item.amount,event)} type='text' name='quantity' label="Quantity" placeholder="Quantity" variant="outlined" size="small" fullWidth />
                            </div>

                            <div className={classes.budget2}>
                              <div className={classes.column} >
                              <Typography >Budget name</Typography>
                              </div>
                              <div  className={classes.columnQuantity}>
                                <Typography >Remain quantity</Typography>
                              </div>
                              <div  className={classes.column}>
                                <Typography >Used Quantity</Typography>
                              </div>
                            </div>
                              {fieldValueGame && fieldValueGame.length!=0 && jsonBudgets.sort((a, b) => a.orderNumber - b.orderNumber).map((budget)=>{
                                if(item.id==budget.walletId){
                                return(
                                  <div className={classes.budget} key={budget.id}>
                                  <div className={classes.column} >
                                  <Typography className={classes.nameW2}>{budget.name}</Typography>
                                  </div>
                                  <div  className={classes.columnQuantity}>
                                    <Typography className={classes.nameW2}>{budget.quantity}</Typography>
                                  </div>
                                  <div  className={classes.column}>
                                  <TextField value={budget.usedQuantity}  onChange={event => handleChangeInputBudget(budget.id,event)} type='number' name='usedQuantity' label="Used quantity" variant="outlined" size="small" />
                                  </div>
                                </div>
                                )}
                              })}
                              <br/>
                             </div>
                              )
                          })}
                          {fieldValueGame && fieldValueGame.length!=0 && fieldValueWallet.length>0 && <Typography className={classes.nameWText}>Base price: {basePrice=='0' ? '0.00': Math.round(basePrice*100)/100 }</Typography> }
                          <Field  as={TextField}type='number'value={props.values.salePrice}
                                  onChange={(e) => {
                                    ChangeSalePrice(e.target.value);
                                    props.setFieldValue("salePrice", e.target.value);
                                  }} name='salePrice'label="Sale Price"
                                  variant="outlined" size="small"fullWidth
                                error={props.errors.salePrice && props.touched.salePrice }
                                helperText={<ErrorMessage name='salePrice' />}  />
                               
                          <FormAutocomplete getOptionLabel={(option) => option.fullName} onChangeSelect={(value) => setFieldValueClient(value)} className={classes.fontText} label='Client' name="Client"  options={jsonClients} /> 
                          {salePrice && fieldValueClient && fieldValueClient.length!=0 && 
                          <FormAutocomplete placeholder="Select one or multiple"onChange={(event, values) => {setFieldValueTransaction( values);setChangeTransaction(values)}} getOptionLabel={(option) => option.code} multiple={true} filterSelectedOptions={true}className={classes.fontText} name="Transaction" label='Transaction' options={jsonTransactions.sort((a, b) => a.remainAmount-b.remainAmount)} /> 
                          }
                    {salePrice && fieldValueTransaction.length>0 &&     
                    <div className={classes.budget}>
                    <div className={classes.column} >
                        <Typography >Transactions</Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography >Remain amount</Typography>
                     </div>
                      <div  className={classes.column}>
                       <Typography >Used amount</Typography>
                      </div>
                    </div>
                    }  
                    { salePrice && fieldValueTransaction.map((item)=>{
                      return(
                      <div className={classes.budget} key={item.id}>                     
                      <div className={classes.column} >
                          <Typography >{item.code}</Typography>
                      </div>
                      <div  className={classes.column}>
                          <Typography >{number.format(item.remainAmount)} ₫</Typography>
                       </div>
                        <div  className={classes.column}>
                         <Typography >{number.format(item.usedAmount)} ₫</Typography>
                        </div>
                      </div>
                      )
                    })}
                    {salePrice && fieldValueTransaction.length>0 && <Typography className={classes.nameWText}>Pair Amount: {number.format(totalUsedAmount)} ₫</Typography> }
                          <Field  as={TextField} type='number' name='bonus'label="Bonus" variant="outlined" size="small"fullWidth /> 
                          <Field  as={TextField} className={classes.fontText} value={props.values.information} multiline minRows='5' name='information'label="Information" variant="outlined" size="small"fullWidth /> 
                          <Field  as={TextField}  multiline minRows='4' name='notes'label="Notes" variant="outlined" size="small"fullWidth />   
                          <input accept="image/*" className={classes.input} onChange={viewAvatar}  id="file" name='img'  multiple type="file"/>
                      <label htmlFor="file" className={classes.fontText} >
                                <Button component="span" className={classes.fontText} color="primary">
                                UPLOAD PHOTOS
                                </Button>
                            </label>    
                            <div className="result">{renderPhotos(selectedFiles)}</div>             
      {errorMessage.length > 0 && <Alert severity="error" className={classes.errortext}>{errorMessage}</Alert>	}          

                            <Button type='submit' className={classes.button} variant='contained'size="large" fullWidth
                                color='primary'>Create</Button>
                        </Form>
                    )}
                </Formik>
        </Paper>
    </div>
  )
}

export default AddOrders

const useStyles = makeStyles((theme) => ({

errortext:{
    margin: theme.spacing(1,0),
},
budget:{
display:'flex',
margin:theme.spacing(1,0),
},
budget2:{
  display:'flex',
  margin:theme.spacing(3,0,0,0),
},
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
    margin: theme.spacing(0,0,2,0),
},

button:{
    margin: theme.spacing(5 ,0),
},

nameW:{
  flexGrow:1,
  fontWeight:500,
  fontSize:'16px', 
   minWidth:'50%',
  margin: theme.spacing(2,2,0,0), 
},
nameWText:{
  flexGrow:1,
  fontWeight:500,
  fontSize:'16px', 
  margin: theme.spacing(0,0,2,0), 
},
nameW2:{
  margin: theme.spacing(2,2,0,0), 
},

column:{
  flexBasis: '33.33%',
  [theme.breakpoints.down("sm")]:{
    flexBasis: '40%',
  },
},
columnQuantity:{
flexBasis: '33.33%',
[theme.breakpoints.down("sm")]:{
  flexBasis: '30%',
},
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
photoimg:{
  width:'90px',
  height:'90px',
  margin: theme.spacing(1),
},
}));
  