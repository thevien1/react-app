import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { Tabtitle } from '../Login/Title';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Button,Paper,CircularProgress, Grid, IconButton, InputAdornment, OutlinedInput, TextField } from '@material-ui/core';
import { Delete, DoneAll, Done, Search, Undo } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { AddToQueue } from '@material-ui/icons';
import axios from '../Api/axios';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const Orders = () => {
    Tabtitle('Orders')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState([])
    const idProductRef = useRef()
    const idProductRefpage = useRef()
    const idProductRef_name = useRef()
    const idProductRef_paymentStatus = useRef()
    const [students, setStudents] = useState([]);
    const [Message, setMessage] = useState(false);
    const [messages, setMessages] = useState('');
    const [DonePage, setDonePage] = useState('0');
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [jsonResuls, setJsonResuls] = useState([])
    const [games, setGames] = useState([])
    const [photos, setPhotos] = useState([])
    const [clients, setClients] = useState([])
    const [budgetOrders, setBudgetOrders] = useState([])
    const [budgetOrdersId, setBudgetOrdersId] = useState([])
    const [transactions, setTransactions] = useState([])
    const [search, setSearch] = useState({
      orderId:'',
      status:'',
      paymentStatus:'',
    });

    const SearchText = (e) => {
      setSearch({
        ...search,
        [e.target.name]: e.target.value,
      });
    };
const pageSize = 10
useEffect(()=>{
  setCurrentPage(1)
  setDonePage(0)
  Promise.all([
    axios.get(`?get_orders=&status=${search.status}&paymentStatus=${search.paymentStatus}&clientId=${selected?.id}&orderId=${search.orderId}`),
    axios.get(`?get_clients=&name=&phoneNumber=`),
    axios.get(`?get_games=&name=`),
    axios.get(`?get_budgetsorders=`),
    axios.get(`?get_photos=`),
  ]).then(results => {
    const [orders, clients, games, budgets, photos] = results.map(res => res.data);
    setProduct(orders);
    setPagination(_(orders).slice(0).take(pageSize).value());
    setClients(clients);
    setJsonResuls(clients);
    setGames(games);
    setBudgetOrders(budgets);
    setPhotos(photos);
  }).catch(error => console.error(error));
},[search,selected])
const pageCount = product ? Math.ceil(product.length/pageSize) :0  
 setTimeout(function() {
    setMessage(false)
}, 200);


    
    const handleClickOpen = async (id,page,name,paymentStatus) => {
      const data = await axios.get(`?get_budgetsordersId=${id}`)
      setBudgetOrdersId(data.data)
      const data1 = await axios.get(`?get_transaction_orderId=${id}`)
      setTransactions(data1.data)

      setOpen(true);
      idProductRef.current = id;
      idProductRefpage.current = page;
      idProductRef_name.current = name;
      idProductRef_paymentStatus.current = paymentStatus;
      if(name=='inProgress'){
        setMessages('Are you sure to complete this order?')
      }
      if(name=='completed'){
        setMessages('Are you sure to mark done this order? You can not update anything after mark done it.')
      }
      if(name=='doneAll'){
        setMessages('Are you sure to mark done this order? You can not update anything after mark done it.')
      }
      if(name=='done'){
        setMessages('Are you sure to complete this order?')
      } 
      if(name=='delete'){
        setMessages('Are you sure to delete this order?')
      }
 };


const handleDelete = async () => {
if(idProductRef_name.current!='doneAll'){
  const transactionOders = transactions.map(row => `${row.transactionId}/${row.transactionsordersAmount}/${row.remainAmount}`).join(',');
  const budgetsordersId = budgetOrdersId.map(row => `${row.budgetId}/${row.budgetsQuantity}/${row.quantity}/${row.positive}/${row.budgetsPrice}/${row.walletsPrice}/${row.packages}/${row.walletsId}`).join(',');

  let formData = new FormData();
  if(idProductRef_name.current=='inProgress'){
    idProductRef_name.current='completed'
  }else if(idProductRef_name.current=='completed'){
    idProductRef_name.current='done'
  }
  else if(idProductRef_name.current=='done'){
    idProductRef_name.current='completed'
  }else{
    idProductRef_name.current='delete'
  }
  formData.append('status', idProductRef_name.current)
  formData.append('paymentStatus', idProductRef_paymentStatus.current)
  formData.append('id', idProductRef.current)
  formData.append('transactionOders', transactionOders)
  formData.append('budgetsorders', budgetsordersId)
  formData.append('update_status_oder', '')
axios.post('', //Url
  formData, 
  { headers: {'Content-Type': 'multipart/form-data' }
}).then(function (response) {

 console.log(response)
})

      setMessage(true)
      setOpen(false);
  setTimeout(function() {
      Promise.all([
        axios.get(`?get_orders=&status=${search.status}&paymentStatus=${search.paymentStatus}&clientId=${selected?.id}&orderId=${search.orderId}`),
  
      ]).then(results => {
        const [orders] = results.map(res => res.data);
        setProduct(orders);
        if(orders.length==idProductRefpage.current){
          idProductRefpage.current=idProductRefpage.current-pageSize
        }
        setCurrentPage(Math.ceil(idProductRefpage.current/pageSize)+1)
    
        const pagination = _(orders).slice(idProductRefpage.current).take(pageSize).value();
        setPagination(pagination);
  
  
      })
    }, 10);
   
}
if(idProductRef_name.current==='doneAll'){
  pagination.map((item)=>{
    if(item.status=='completed'){
      let formData6 = new FormData();
      formData6.append('id', item.id)
      formData6.append('update_status_ordersAll', '')
    axios.post('', //Url
    formData6, 
    { headers: {'Content-Type': 'multipart/form-data' }
  })
    }
  })

setMessage(true)
      setOpen(false);
  setTimeout(function() {
      Promise.all([
        axios.get(`?get_orders=&status=${search.status}&paymentStatus=${search.paymentStatus}&clientId=${selected?.id}&orderId=${search.orderId}`),
      ]).then(results => {
        const [orders] = results.map(res => res.data);
        setProduct(orders);
        if(orders.length==idProductRefpage.current){
          idProductRefpage.current=idProductRefpage.current-pageSize
        }
        setCurrentPage(Math.ceil(idProductRefpage.current/pageSize)+1)
        const pagination = _(orders).slice(idProductRefpage.current).take(pageSize).value();
        setPagination(pagination);
      })
    }, 30);
}
}; 
    const handleClose = () => {
      setOpen(false);
    };
    const Pagechane = (event, value) =>{
      const startIndex = (value -1)*pageSize
       const pagination= _(product).slice(startIndex).take(pageSize).value()
       setPagination(pagination)
       setCurrentPage(value)
       setMessage(true)
       setDonePage(startIndex)
   }
   let number = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });
  let numbers = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  // const HtmlTooltip = withStyles((theme) => ({
  //   tooltip: {
  //     backgroundColor: theme.palette.common.white,
  //     color: 'rgba(0, 0, 0, 0.87)',
  //     fontSize: theme.typography.pxToRem(12),
  //     boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 2px 0 rgb(63 63 68 / 15%)',
  //     margin:'auto',
  //     maxWidth:'1000px',
  //     top: 'auto',
  //   },
  // }))(Tooltip);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: theme.typography.pxToRem(12),
        boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 2px 0 rgb(63 63 68 / 15%)',
        margin: '0px -10px 0 -10px', 
        maxWidth:'1000px',
    },
  }));
  return (
    <div>
      <NavLink to='/app/orders/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD Order</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container spacing={1} >
      <Grid item  lg={3} md={4} sm={6} xs={12} >
          <FormControl className={classes.formControl} fullWidth variant="outlined" >
        <InputLabel>Status</InputLabel>
        <Select value={search.status} onChange={SearchText} label="Status" name='status'>
        <MenuItem value='none' className={classes.select}>None</MenuItem>
        <MenuItem value='completed' className={classes.select}>Completed</MenuItem>
          <MenuItem value='inProgress' className={classes.select}>In progress</MenuItem>
          <MenuItem value='done' className={classes.select}>Done</MenuItem>
        </Select>
      </FormControl>
          </Grid>
          <Grid item  lg={3} md={4} sm={6} xs={12} >
          <FormControl className={classes.formControl} fullWidth variant="outlined" >
        <InputLabel>Payment Status</InputLabel>
        <Select value={search.paymentStatus} onChange={SearchText} label="Payment Status" name='paymentStatus'>
        <MenuItem value='none' className={classes.select}>None</MenuItem>
        <MenuItem value='paid' className={classes.select}>Paid</MenuItem>
          <MenuItem value='unPaid' className={classes.select}>Un paid</MenuItem>
          <MenuItem value='partPaid' className={classes.select}>Part paid</MenuItem>
        </Select>
      </FormControl>
          </Grid>  
          <Grid item  lg={3} md={4} sm={6} xs={12} >
                    <Autocomplete
                          className={classes.fontText}
                            options={jsonResuls}
                            fullWidth
                            onChange={(event, value) => setSelected(value)}
                            getOptionSelected={(option, value) => option.id === value.id}
                            getOptionLabel={(jsonResuls) => jsonResuls.fullName}
                            renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
                          />
          </Grid>  
          <Grid item  lg={3} md={4} sm={6} xs={12} >
          <OutlinedInput fullWidth onChange={SearchText}  placeholder="Search by orders id"   name='orderId'     
            startAdornment={<InputAdornment position="start"><Search color="action"/></InputAdornment>}
          ></OutlinedInput>
          </Grid>
        </Grid>
        </Paper>
      </Grid>
      {Message && 
      <div className={classes.center}>
      <CircularProgress />
      </div>
      }
      <TableContainer component={Paper}>
      <Table className={classes.table}  aria-label="a dense table">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell >Client</TableCell>
            <TableCell >Game</TableCell>
            <TableCell >Sales</TableCell>
            <TableCell >Revenue</TableCell>
            <TableCell >Bonus Amount</TableCell>
            <TableCell >Payment Status</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Created date</TableCell>
            <TableCell >Template</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagination.map((row) => { 
            var nullCreate = row.createdAt.split(" ");
            var dateCreate = nullCreate[0].split("-");
            var dateCreateAt= dateCreate[2]+'/'+dateCreate[1]+'/'+dateCreate[0]
           
            var nullUpdate = row.updatedAt.split(" ");
            var dateupdate = nullUpdate[0].split("-");
            var dateUpdateAt= dateupdate[2]+'/'+dateupdate[1]+'/'+dateupdate[0]
            
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
            let image = ''; 
            photos.map((item)=>{
              if(item.orderId==row.id){
              image += `\n ${`http://localhost:81/react-app/public/images/`+item.image}`
              }
            })

            let result = "";
            orderMap.forEach((details, orderId) => {
              if(orderId==row.id){
              const formattedDetails = details.length > 1 ? `\n ${details.join('\n ')}` : details.join('\n');
              result += `${formattedDetails}\n`;
            }
            });
       
const text = `Order ID: `+row.id+`\nGame Name: `
            +(games.find(itemG => itemG.id === row.gameId)?.name || '')
            +`\n`+row.info
            +`\nRecharge: `
            +result
            +`Status: `+row.status.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, function(str){ return str.toUpperCase(); })
            +`${image==''? '' : `\nPhotos: `+image}`

            return(
            <TableRow key={row.id}>
              <TableCell ><NavLink className={classes.link2}  to={`/app/orders/${row.id}`} >{row.id}</NavLink></TableCell>
              <TableCell >
              {clients.find(itemC => itemC.id === row.clientId)?.fullName || ''}
              </TableCell>
              <TableCell >
              {games.find(itemG => itemG.id === row.gameId)?.name || ''}
              </TableCell>
              <TableCell >{number.format(Number(row.salePrice))} ₫</TableCell>
              <TableCell >{number.format(Number(row.salePrice)-Number(row.basePrice))} ₫</TableCell>
              <TableCell >{number.format(Number(row.bonusAmount))} ₫</TableCell>
              <TableCell >{row.paymentStatus.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, function(str){ return str.toUpperCase(); })}</TableCell>
              <TableCell >{row.status.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, function(str){ return str.toUpperCase(); })}</TableCell>
              <TableCell >{dateCreateAt}</TableCell>
              <TableCell >    
              <HtmlTooltip placement="left-start"  
        title={
          <React.Fragment>
            <Typography color="inherit" className={classes.textnote}>{text}</Typography>
          </React.Fragment>
        }
      >
        <Button variant="contained"onClick={() =>  navigator.clipboard.writeText(`${text}`)} color="primary" size="small">Copy</Button>
      </HtmlTooltip>
              </TableCell>
              <TableCell size='small' align="center">
              <NavLink to={`/app/orders/${row.id}`} >
                <IconButton color="primary" >
                <AddToQueue/>
                </IconButton>
                </NavLink>
              <IconButton color="primary" onClick={(id,page,name,paymentStatus) => handleClickOpen(row.id,DonePage,`${row.status}`,row.paymentStatus)}>
                {row.status=='inProgress' &&<Done />}
                {row.status=='completed' &&<DoneAll />}
                {row.status=='done' &&<Undo />}
                </IconButton>
                {row.status!=='done' &&
                <IconButton color="primary" onClick={(id,page,name,paymentStatus) => handleClickOpen(row.id,DonePage,'delete',row.paymentStatus)}>
                <Delete  />
                </IconButton>}
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      <Grid container spacing={0} className={classes.trang2} >
      <Button variant="contained" color="primary" onClick={(id,page,name) => handleClickOpen(0,DonePage,'doneAll')}  size='medium' >DONE ORDERS OF THIS PAGE</Button>
      </Grid>
      {product.length >10 && 
    <Grid container spacing={0} className={classes.trang} >
        <Pagination count={pageCount} page={currentPage} onChange={Pagechane} size='small' color='primary' />
    </Grid> }
    </TableContainer>
    
    <Dialog
        open={open} 
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent className={classes.textColor}>
          <DialogContentText  >
          {messages}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>Cancel</Button>
          <Button onClick={handleDelete} autoFocus color='primary'>
          Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Orders

const useStyles = makeStyles((theme) => ({
link:{
    padding:theme.spacing(0,0,2,0),
    color:'inherit',
    textDecoration:'none', 
    float: 'right',
    '&.active > div':{
        color:theme.palette.primary.main,
    }
},
table: {
    minWidth: 650,
  },
centerGrid:{
    width:'100%',
    height:'auto',
    margin:'40px auto',
    [theme.breakpoints.down("sm")]:{
      width:'100%',
    },    
},
paper: {
    flexGrow: 1,
    padding: theme.spacing(3),
    margin: 'auto',
    [theme.breakpoints.down("sm")]:{
    height: 'auto',
  }, 
},
trang:{
  justifyContent:'center',
  color:'#000',
  display:'flex',
  margin:'0px auto 10px auto',
},
textColor:{
  '& .MuiDialogContentText-root': {
    color:'#546e7a', // thay đổi màu sắc ở đây
},
},
center:{
  display:'flex',
  justifyContent:'center',
},
formControl: {
  '& .MuiOutlinedInput-notchedOutline': {
      borderColor:'rgba(0, 0, 0, 0.23)', // thay đổi màu sắc ở đây
  },
},
link2:{
textDecoration:'none',
color:'blue',
},
textnote:{
  whiteSpace:'pre-wrap',
  wordWrap:'break-word',
  color: '#263238',
  fontWeight:400,
  fontSize:'16px',
  lineHeight:1.6,
  letterSpacing:'0.00958em',
  fontFamily: [
    '"Roboto"',
    '"Helvetica"',
    '"Arial"',
    '"sans-serif"',
  ].join(', '),
},
trang2:{
  justifyContent:'center',
  margin:'30px auto',
},
}));
