import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Divider, Grid, TextField, Typography } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../Api/axios';
import { Autocomplete } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import { Delete } from '@material-ui/icons';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@mui/material/Tooltip';
import { Tabtitle } from '../Login/Title';

const DetaiOrders = () => {
  Tabtitle('Detai order')
const classes = useStyles();
const { id } = useParams();
let navigate = useNavigate()
const [items, setItems] = useState([])
const [games, setGames] = useState([])
const [photos, setPhotos] = useState([])
const [clients, setClients] = useState([])
const [jsonTransactions, setJsonTransactions] = useState([])
const [fieldValueTransaction, setFieldValueTransaction] = useState([])
const [budgetOrders, setBudgetOrders] = useState([])
const [transactions, setTransactions] = useState([])
const [Message, setMessage] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [avatar,setAvatar] = useState([])
const [images,setImages] = useState([])
const [isLoading, setIsLoading] = useState(false);
useEffect(()=>{
    Promise.all([
        axios.get(`?get_orderId=${id}`),
        axios.get(`?get_clients=&name=&phoneNumber=`),
        axios.get(`?get_games=&name=`),
        axios.get(`?get_budgetsordersId=${id}`),
        axios.get(`?get_photos_orderId=${id}`),
        axios.get(`?get_transaction_orderId=${id}`),
      ]).then(results => {
        const [orders, clients, games, budgets, photos,transactions] = results.map(res => res.data);
        setItems(orders);
        setClients(clients);
        setGames(games);
        setBudgetOrders(budgets);
        setPhotos(photos);
        setImages(photos)
        setTransactions(transactions)
        axios.get(`?get_transactions_clienId=${orders.clientId}`).then((response) => {
        setJsonTransactions(response.data);

    });
      })
},[id])

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
let numbers = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  let number = new Intl.NumberFormat('en-US');
const reducedOrders = budgetOrders.reduce((acc, cur) => {
    const index = acc.findIndex(item => item.orderId === cur.orderId && item.walletsId === cur.walletsId);
    if (index === -1) {
      acc.push({
        orderId: cur.orderId,
        walletsId: cur.walletsId,
        items: [{
          name: cur.name,
          usedQuantity: Number(cur.usedQuantity),
          totalAmount: Number(cur.totalAmount),
        }],
      });
    } else {
      acc[index].items.push({
        name: cur.name,
        usedQuantity: Number(cur.usedQuantity),
        totalAmount: Number(cur.totalAmount),
      });
    }
    return acc;
  }, []);
  
  reducedOrders.forEach(order => {
    const totalAmounts = order.items.map(item => item.totalAmount);
    const total = totalAmounts.reduce((total, amount) => total + amount, 0);
    const itemsSummary = order.items.map(item => `${item.name} x ${item.usedQuantity}`).join(', ');
    // console.log(`id ${order.orderId} là Number(${totalAmounts.join('+')})$ (${itemsSummary})`);
    // console.log(`id ${order.orderId} là Number(${total})$ (${itemsSummary})`);
  });
  const orderMap = new Map();
  reducedOrders.forEach(order => {
    const {orderId, items} = order;
    let orderDetails = orderMap.get(orderId);
    if (!orderDetails) {
      orderDetails = [];
    }
    const itemDetails = items.map(item => `${item.name} x ${numbers.format(item.usedQuantity)}`).join(", ");
    orderDetails.push(`${items.map(item => item.totalAmount).reduce((total, amount) => total + Number(numbers.format(amount)))}$ (${itemDetails}) `);
    orderMap.set(orderId, orderDetails);
  });   
  let result = "";
  
  orderMap.forEach((details, orderId) => {
    if(orderId==items.id){
    const formattedDetails = details.length > 1 ? `\n ${details.join('\n ')}` : details.join('\n');
    result += `${formattedDetails}\n`;
  }
  });
  localStorage.setItem('createAt', items.createdAt)
  localStorage.setItem('updateAt', items.updatedAt)
  localStorage.setItem('status', items.status)
  localStorage.setItem('paymentStatus', items.paymentStatus)
  const createAt = localStorage.getItem("createAt");
  const updateAt = localStorage.getItem("updateAt");  
  var nullCreate = createAt.split(" ");
  var dateCreate = nullCreate[0].split("-");
  var dateCreateAt= dateCreate[2]+'/'+dateCreate[1]+'/'+dateCreate[0]
 
  var nullUpdate = updateAt.split(" ");
  var dateupdate = nullUpdate[0].split("-");
  var dateUpdateAt= dateupdate[2]+'/'+dateupdate[1]+'/'+dateupdate[0]
  
  const status = localStorage.getItem("status");  
  const paymentStatus = localStorage.getItem("paymentStatus"); 
  let image = "";
            photos.map((item)=>{
              if(item.orderId==items.id){
              image += `\n ${`http://localhost:81/react-app/public/images/`+item.image}`
              }
            })
  const text = `Order ID: `+items.id+`\nGame Name: `
                +(games.find(itemG => itemG.id === items.gameId)?.name || '')
                +`\n`+items.info
                +`\nRecharge: `
                +result
                +`Status:  ${status.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}`
                +`${image==''? '' : `\nPhotos: `+image}`

const setChangeTransaction = async (values,a) =>{
    const sortedValues = values.sort((a, b) => a.remainAmount-b.remainAmount);

    let remainQuantity = 0;
      let updatedRows = sortedValues.map((item, index) => {
        let usedAmount = 0;
        if (index === 0) {
          // id1: usedAmount=salePrice-item.remainAmount
          usedAmount = items.salePrice - item.remainAmount;
          if(usedAmount>0){
            usedAmount = item.remainAmount;
            remainQuantity = items.salePrice - item.remainAmount;
          }else{
            usedAmount =items.salePrice;
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

const totalUsedAmount = fieldValueTransaction.reduce((total, item) => total + Number(item.usedAmount), 0);

const handleSubmit = async (e,name) => {
e.preventDefault()
  if(name=='transaction'){
  const transactionOders = fieldValueTransaction.map(row => `${row.id}/${row.usedAmount}/${row.remainAmount}`).join(',');
  var paymentStatus = ''
if(totalUsedAmount==0){
  paymentStatus='unPaid'
}else if(items.salePrice<=totalUsedAmount){
  paymentStatus='paid'
}else{
  paymentStatus='partPaid'
}
let formData = new FormData();
  formData.append('paidAmount', totalUsedAmount)
  formData.append('paymentStatus', paymentStatus)
  formData.append('id', id)
  formData.append('transactionOders', transactionOders)
  formData.append('update_transaction_oder', '')
axios.post('', //Url
  formData, 
  { headers: {'Content-Type': 'multipart/form-data' }
}).then(function (response) {
 console.log(response)
})
}
if(name=='photos'){

avatar.sort((a, b) => a.size - b.size).map((image, i) =>{
  let formData6 = new FormData();
  formData6.append('id', id)
  formData6.append('avatar', image)
  formData6.append('update_orderphotos', '')
axios.post('', //Url
formData6, 
{ headers: {'Content-Type': 'multipart/form-data' }
})
})
setAvatar([]);
setSelectedFiles([]);

}
setMessage(true)
setTimeout(function() {
  Promise.all([
    axios.get(`?get_orderId=${id}`),
    axios.get(`?get_clients=&name=&phoneNumber=`),
    axios.get(`?get_games=&name=`),
    axios.get(`?get_budgetsordersId=${id}`),
    axios.get(`?get_photos_orderId=${id}`),
    axios.get(`?get_transaction_orderId=${id}`),
  ]).then(results => {
    const [orders, clients, games, budgets, photos,transactions] = results.map(res => res.data);
    setItems(orders);
    setClients(clients);
    setGames(games);
    setBudgetOrders(budgets);
    setPhotos(photos);
    setImages(photos)
    setTransactions(transactions)
    axios.get(`?get_transactions_clienId=${orders.clientId}`).then((response) => {
    setJsonTransactions(response.data);
});
  })
}, 50);
}

const Submitcompleted = async (name) => {

  const transactionOders = transactions.map(row => `${row.transactionId}/${row.transactionsordersAmount}/${row.remainAmount}`).join(',');
  const budgetsorders = budgetOrders.map(row => `${row.budgetId}/${row.budgetsQuantity}/${row.quantity}/${row.positive}/${row.budgetsPrice}/${row.walletsPrice}/${row.packages}/${row.walletsId}`).join(',');

  let formData = new FormData();
  formData.append('status', name)
  formData.append('paymentStatus', items.paymentStatus)
  formData.append('id', id)
  formData.append('transactionOders', transactionOders)
  formData.append('budgetsorders', budgetsorders)
  formData.append('update_status_oder', '')
axios.post('', //Url
  formData, 
  { headers: {'Content-Type': 'multipart/form-data' }
}).then(function (response) {
  navigate('/app/orders/')
 console.log(response)
})
setTimeout(function() {
  Promise.all([
    axios.get(`?get_orderId=${id}`),
    axios.get(`?get_clients=&name=&phoneNumber=`),
    axios.get(`?get_games=&name=`),
    axios.get(`?get_budgetsordersId=${id}`),
    axios.get(`?get_photos_orderId=${id}`),
    axios.get(`?get_transaction_orderId=${id}`),
  ]).then(results => {
    const [orders, clients, games, budgets, photos,transactions] = results.map(res => res.data);
    setItems(orders);
    setClients(clients);
    setGames(games);
    setBudgetOrders(budgets);
    
    setPhotos(photos);
    setImages(photos)
    setTransactions(transactions)
    axios.get(`?get_transactions_clienId=${orders.clientId}`).then((response) => {
    setJsonTransactions(response.data);
});
  })
}, 50);
}
const DeleteImg = async (idPhotos) => {
  let formData = new FormData();
  formData.append('idPhotos', idPhotos)
  formData.append('delete_photo_order', '')
axios.post('', //Url
  formData, 
  { headers: {'Content-Type': 'multipart/form-data' }
}).then(function (response) {
  setMessage(true)
 console.log(response)
})
  setTimeout(function() {
    Promise.all([
      axios.get(`?get_orderId=${id}`),
      axios.get(`?get_clients=&name=&phoneNumber=`),
      axios.get(`?get_games=&name=`),
      axios.get(`?get_budgetsordersId=${id}`),
      axios.get(`?get_photos_orderId=${id}`),
      axios.get(`?get_transaction_orderId=${id}`),
    ]).then(results => {
      const [orders, clients, games, budgets, photos,transactions] = results.map(res => res.data);
      setItems(orders);
      setClients(clients);
      setGames(games);
      setBudgetOrders(budgets);
      
      setPhotos(photos);
      setImages(photos)
      setTransactions(transactions)
      axios.get(`?get_transactions_clienId=${orders.clientId}`).then((response) => {
      setJsonTransactions(response.data);
  });
    })
  }, 50);
}


setTimeout(function() {
  setMessage(false)
}, 200);


const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index) => {
    setIsOpen(true);
    setCurrentIndex(index);
    setIsLoading(true)
    setTimeout(function() {
      setIsLoading(false)
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setIsLoading(true)
    setTimeout(function() {
      setIsLoading(false)
    }, 200);
    setCurrentIndex((currentIndex + 1) % images.length);

  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex + images.length - 1) % images.length);
    setIsLoading(true)
    setTimeout(function() {
      setIsLoading(false)
    }, 200);

  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isOpen) {
        if (event.key === 'ArrowLeft' && currentIndex > 0) {
          handlePrev();
        } else if (event.key === 'ArrowRight' && currentIndex < images.length - 1) {
          handleNext();
        } else if (event.key === 'Escape') {
          handleClose();
        } else if (event.key === 'Enter') {
          const element = document.documentElement;
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) { /* Firefox */
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) { /* IE/Edge */
            element.msRequestFullscreen();
          }
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, handlePrev, handleNext, handleClose, images.length]);
  
  
return (
<div>
<Typography variant='h2' className={classes.detail}>Detai order</Typography>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Game:</Typography>
    </Grid>   
    <Grid item xs={10}>
    <Typography variant='h5' className={classes.textTwo}>{games.find(itemG => itemG.id === items.gameId)?.name || ''}</Typography>
    </Grid> 
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Client:</Typography>
    </Grid>   
    <Grid item xs={10}>
    <Typography variant='h5' className={classes.textTwo}>{clients.find(itemC => itemC.id === items.clientId)?.fullName || ''}</Typography>
    </Grid> 
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Information:</Typography>
    </Grid>   
    <Grid item xs={4}>
    <Typography variant='h5' className={classes.textTwo}><pre className={classes.pre}>{text}</pre></Typography>
    </Grid>
    <Grid item xs={1}>
    <Button color="primary" onClick={() =>  navigator.clipboard.writeText(`${text}`)} style={{width:'100px'}} size='small'variant="contained">Copy</Button>
    </Grid>  
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Status:</Typography>
    </Grid>   
    <Grid item xs={10}>
    <Typography variant='h5' className={classes.textTwo}>{status.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</Typography>
    </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Payment Status:</Typography>
    </Grid>   
    <Grid item xs={10}>
    <Typography variant='h5' className={classes.textTwo}>{paymentStatus.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</Typography>
    </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Base price:</Typography>
    </Grid>   
    <Grid item xs={10}>
    {/* <Typography variant='h5' className={classes.textTwo}>{number.format(items.basePrice)+' ₫'}</Typography> */}
    </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Sale price:</Typography>
    </Grid>   
    <Grid item xs={10}>
    <Typography variant='h5' className={classes.textTwo}>{number.format(items.salePrice)+' ₫'}</Typography>
    </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}></Grid>
<Grid container spacing={0} className={classes.gridmain2}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Budgets</Typography>
    </Grid>   
    <Grid item xs={3}>
    <Typography className={classes.textTwo}>Wallet</Typography>
    </Grid>
    <Grid item xs={3}>
    <Typography  className={classes.textTwo}>Budget</Typography>
    </Grid>
    <Grid item xs={3}>
    <Typography  className={classes.textTwo}>Price</Typography>
    </Grid>
</Grid>
{budgetOrders.map((item)=>{
   return(
<Grid container spacing={0} className={classes.gridmain2} key={item.id}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}></Typography>
    </Grid>   
    <Grid item xs={3}>
    <Typography className={classes.textTwo}>{item.walletsName}</Typography>
    </Grid>
    <Grid item xs={3}>
    <Typography  className={classes.textTwo}>{item.name}</Typography>
    </Grid>
    <Grid item xs={3}>
    <Typography  className={classes.textTwo}>{number.format(item.budgetsPrice)+' ₫ x '+number.format(item.usedQuantity)}</Typography>
    </Grid>
</Grid>
   ) 
})}
<Divider style={{backgroundColor:'#000',margin:'15px 0 0 4px'}}/>
{items.paymentStatus=='unPaid' && 
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Transactions:</Typography>
    </Grid>  
    <Grid item xs={5}>   
    <Autocomplete
              multiple
              className={classes.fontngoai}
              options={jsonTransactions}
              fullWidth
              filterSelectedOptions
              onChange={(event, value) => setChangeTransaction(value)}
              getOptionLabel={(jsonTransactions) => jsonTransactions.code}
              size="medium"
              renderInput={(params) => <TextField {...params} label="Transaction" placeholder="Select one or multiple" variant="outlined" />}
            />
           
    </Grid>  
</Grid>
}
{items.paymentStatus=='unPaid' && fieldValueTransaction.length>0 && 
<>

    <Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}></Grid>
    <Grid item xs={2}><Typography  className={classes.textTwo}>Transactions</Typography></Grid>
    <Grid item xs={2}><Typography  className={classes.textTwo}>Remain amount</Typography></Grid>
    <Grid item xs={2}><Typography  className={classes.textTwo}>Used amount</Typography></Grid>
    </Grid>
{fieldValueTransaction.map((item)=>{
  return(
    <Grid container spacing={0} className={classes.gridmain2} key={item.id}>
    <Grid item xs={2}></Grid>
    <Grid item xs={2}><Typography  className={classes.textTwo}>{ item.code}</Typography></Grid>
    <Grid item xs={2}><Typography  className={classes.textTwo}>{number.format(item.remainAmount)} ₫</Typography></Grid>
    <Grid item xs={2}><Typography  className={classes.textTwo}>{number.format(item.usedAmount)} ₫</Typography></Grid>
    </Grid>
  )
})}
 <Grid container spacing={1} className={classes.gridmain} >
    <Grid item xs={2}></Grid>  
    <Grid item xs={4}>
    <Typography  className={classes.textThree}>Pair Amount: {number.format(fieldValueTransaction.reduce((total, item) => total + Number(item.usedAmount), 0))} ₫</Typography>
      </Grid> 
  </Grid>
  <Grid container spacing={1} className={classes.gridmain} >
    <Grid item xs={2}></Grid>  
    <Grid item xs={5}>
    <Button onClick={(e,name) =>handleSubmit(e,'transaction')} variant="contained" name='create_game' color="primary"  fullWidth size='large' >ADD Transaction</Button>
      </Grid> 
  </Grid>        
</>    
} 
{transactions.length>0 && <Grid container spacing={1} className={classes.gridmain}></Grid>}
{transactions.length>0 && <Grid container spacing={0} className={classes.gridmain2} xs={12}>
    <Grid item xs={2} >
    <Typography variant='h5' className={classes.textOne}>Transactions:</Typography>
    </Grid>   
    <Grid item xs={2}>
    <Typography className={classes.textTwo}>ID</Typography>
    </Grid>
    <Grid item xs={2}>
    <Typography  className={classes.textTwo}>Code</Typography>
    </Grid>
    <Grid item xs={3}>
    <Typography  className={classes.textTwo}>Amount</Typography>
    </Grid>
    <Grid item xs={2}>
    <Typography  className={classes.textTwo}>Payment</Typography>
    </Grid>
</Grid>}
{transactions.map((item)=>{
  return(
 <Grid container spacing={0} className={classes.gridmain2} key={item.id}>
    <Grid item xs={2} >
    <Typography variant='h5' className={classes.textOne}></Typography>
    </Grid>   
    <Grid item xs={2}>
    <Typography className={classes.textTwo}>{item.transactionId}</Typography>
    </Grid>
    <Grid item xs={2}>
    <Typography  className={classes.textTwo}>{item.code}</Typography>
    </Grid>
    <Grid item xs={3}>
    <Typography  className={classes.textTwo}>{number.format(item.transactionsordersAmount)} ₫</Typography>
    </Grid>
    <Grid item xs={2}>
    <Typography  className={classes.textTwo}>{item.owner}</Typography>
    </Grid>
</Grid>
)})}
<Divider style={{backgroundColor:'#000',margin:'15px 0 0 4px'}}/>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Bonus Amount:</Typography>
    </Grid>   
    <Grid item xs={4}>
    <Typography variant='h5' className={classes.textTwo}>{number.format(items.bonusAmount)} ₫</Typography>
    </Grid>
    <Grid item xs={1}>
        {Message && 
      <CircularProgress />
    }   </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Notes:</Typography>
    </Grid>   
    <Grid item xs={4}>
    <Typography variant='h5' className={classes.textTwo}>{items.notes} </Typography>
    </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Create date:</Typography>
    </Grid>   
    <Grid item xs={4}>
    <Typography variant='h5' className={classes.textTwo}>{dateCreateAt} </Typography>
    </Grid>
</Grid>
<Grid container spacing={1} className={classes.gridmain}>
    <Grid item xs={2}>
    <Typography variant='h5' className={classes.textOne}>Update date:</Typography>
    </Grid>   
    <Grid item xs={4}>
    <Typography variant='h5' className={classes.textTwo}>{dateUpdateAt} </Typography>
    </Grid>
</Grid>
<div style={{display:'flex',  flexWrap:'wrap',margin: '5px auto'}}>
{images.map((item,index)=>{
  return(
    <div key={index} className={classes.containerImg}>
    <div>
    <img src={`/images/${item.image}`} onClick={() => handleOpen(index)}style={{width:'150px',height:'150px',margin: '1px',cursor:'pointer'}} />
    </div>
  <IconButton color="primary"  className={classes.deleteImg} onClick={() => DeleteImg(item.id)}>
    <Delete  />
</IconButton>
</div>
  )
})}
</div>
{isOpen && (
        <div className={classes.lightbox} >
          <div className={classes.lightboxOverlay}  onClick={handleClose} />
          <div className={classes.headers}>
          <Tooltip title="Close">
            <IconButton  className={classes.closeButton} onClick={handleClose}>
              <CloseIcon  className={classes.icon}/>
            </IconButton>
          </Tooltip>
          </div>
          
            {currentIndex > 0 && (
              <Tooltip title="Prev image">
              <IconButton className={classes.prevButton} onClick={handlePrev}>
              <KeyboardArrowLeftIcon className={classes.icon}/>
              </IconButton>
              </Tooltip>
            )}
            {currentIndex < images.length - 1 && (
              <Tooltip title="Next image">
              <IconButton className={classes.nextButton} onClick={handleNext}>
              <KeyboardArrowRightIcon className={classes.icon}/>
              </IconButton>
              </Tooltip>
            )}
          <div className={classes.lightboxContent}>
            {!isLoading && <img className={classes.lightboxImg} src={`/images/`+images[currentIndex].image} />}
            {isLoading && <CircularProgress className={classes.lightboxImg} />}
          </div>
        </div>
      )}
<div className={classes.imgcanh}>
                <input accept="image/*" className={classes.input} onChange={viewAvatar} id="file"   multiple='multiple' type="file"/>
                    <label htmlFor="file" className={classes.fonttext} >
                    <Button component="span" color="primary">
                    ADD MORE PHOTOS
                    </Button>
                </label>
</div> 
<div className="result">{renderPhotos(selectedFiles)}</div>  
{selectedFiles.length > 0 && <div><Button variant="contained" onClick={(e,name) =>handleSubmit(e,'photos')}  color="primary"   size='small' >Upload photos</Button>  <br/></div>}
<br/>
<Button
  disabled={Message}
  variant="contained"
  onClick={() => {
    if (items.status === 'inProgress') {
        Submitcompleted('completed');
    } else if (items.status === 'completed') {
        Submitcompleted('done');
    } else if (items.status === 'done') {
        Submitcompleted('completed');
    } else {
        Submitcompleted('delete');
    }
}}
  color="primary"
  size="large"
>
  {items.status === "inProgress" && "Completed"}
  {items.status === "completed" && "Mark done"}
  {items.status === "done" && "Undo"}
</Button>
{items.status !== "done" && <Button variant="contained" disabled={Message} onClick={() => Submitcompleted("delete")} color="primary" className={classes.cssdelete} size="large">Delete</Button>}
<br /><br /><br />

</div>
)
}

export default DetaiOrders


const useStyles = makeStyles((theme) => ({
detail:{
    textAlign:'center',
    color:'#3f51b5',
    fontWeight:500,
    fontSize:'29px', 
},

textOne:{
    color:'#3f51b5',
    fontWeight:500,
    fontSize:'1rem',
},
textTwo:{
    color: '#263238',
    fontWeight:400,
    fontSize:'1rem',
   
},

textThree:{
  fontWeight:500,
  fontSize:'20px', 
},
gridmain:{
    margin: theme.spacing(1,0),
},
gridmain2:{
    margin:'6px 0 0 6px',
},
input: {
  display: 'none',
  color:'#3f50b5',
},
photoimg:{
  width:'90px',
  height:'90px',
  margin:'10px',
},
cssdelete:{
  backgroundColor:'#d32f2f',
  color:'#fff',
  marginLeft:'20px',
},
deleteImg:{
  position: 'absolute',
  top: 0,
  left: 0,
},
containerImg:{
  position: 'relative'
},

lightbox: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 900,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down("sm")]:{
    maxWidth:'100vw',
  },
},
// lightboxOverlay: {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   width: '100%',
//   height: '100%',
//   backgroundColor: 'rgba(0, 0, 0, 0.5)',
// },
lightboxOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  marginTop:'128px',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1, // set the z-index value appropriately

},

headers:{
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  marginTop:'64px',
  minHeight: '64px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 2,
},
lightboxContent: {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},
lightboxImg: {
  maxWidth: '90vw',
  maxHeight: '70vh',
  marginLeft:'256px',
  color:'#fff',
  zIndex: 2,
  [theme.breakpoints.down("sm")]:{
    marginLeft:0,
    maxWidth: '70vw',
  },
},
closeButton: {
  position: 'absolute',
  top: '10px',
  right: '12px',
  zIndex: 3,
  // backgroundColor: 'rgba(0, 0, 0,.05)'
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#fff',
  },
},
prevButton:{
  position: 'absolute',
  top: '50%',
  left: '266px', 
  transform: 'translateY(-50%)',
  zIndex: '1',
  backgroundColor: 'rgba(0, 0, 0,.15)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0,.25)',
    color: '#fff',
  },
  [theme.breakpoints.down("sm")]:{
    left:'10px',
  },
},
nextButton:{
  position: 'absolute',
  top: '50%',
  right: '10px', 
  transform: 'translateY(-50%)',
  zIndex: 3,
  backgroundColor: 'rgba(0, 0, 0,.15)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0,.25)',
    color: '#fff',
  },
},
icon:{
  color:'#fff',
},

}));
  