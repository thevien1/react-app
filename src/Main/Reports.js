import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { Tabtitle } from '../Login/Title';
import { Button,Paper,CircularProgress, Grid,  TextField, Box, Divider, Typography, Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer} from '@material-ui/core';
import axios from '../Api/axios';
import { format } from 'date-fns';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
const Orders = () => {
    Tabtitle('Reports')
    const classes = useStyles();
    const [product, setProduct] = useState([])
    const [Message, setMessage] = useState(false);
    const [selectUser, setSelectUser] = useState(null);
    const [selectGame, setSelectGame] = useState(null);
    const [jsonResuls, setJsonResuls] = useState([])
    const [clients, setClients] = useState([])
    const [games, setGames] = useState([])
    const [value, setValue] = React.useState([null, null]);
    const [users, setUsers] = useState([])
    const [usersId, setUsersId] = useState([])

    const userId = localStorage.getItem("id");

useEffect(()=>{
  Promise.all([
    axios.get(`?get_reports=&datetime=${value}&userId=${selectUser?.id}&gameId=${selectGame?.id}`),
    axios.get(`?get_clients=&name=&phoneNumber=`),
    axios.get(`?get_games=&name=`),
    axios.get(`?get_users=&name=&phoneNumber=`),
    axios.get(`?get_users_id=${userId}`),
  ]).then(results => {
    const [orders, clients, games,users,usersId] = results.map(res => res.data);
    setProduct(orders);
    setClients(clients);
    setJsonResuls(clients);
    setGames(games);
    setUsers(users)
    setUsersId(usersId)
  }).catch(error => console.error(error));
},[selectGame,selectUser,value,userId])

 setTimeout(function() {
    setMessage(false)
}, 200);

   let number = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  });
  let numbers = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  const fromDate = value[0] ? format(value[0], 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy');
  const toDate = value[1] ? format(value[1], 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy');

  //console.log(`Từ ngày ${fromDate} đến ngày ${toDate}`);
// reduce to get unique dates from product array

const productId = product.filter(order => {
  if (usersId.code === 'Staff') {
    return userId === order.userId;
  }
  return true;
})
const dates = productId.reduce((acc, cur) => {
  const date = cur.createdAt.slice(0, 10);
  if (!acc[date]) {
    acc[date] = true;
  }
  return acc;
}, {});

// sort the dates in descending order
const sortedDates = Object.keys(dates).sort((a, b) => new Date(b) - new Date(a));
// map over the sorted dates and reduce to get the aggregated data
const result = sortedDates.map((date) => {
  const orderCount = productId.reduce((acc, cur) => {
    if (cur.createdAt.slice(0, 10) === date) {
      acc += 1;

    }
    return acc;
  }, 0);

  const salePrice = productId.reduce((acc, cur) => {
    if (cur.createdAt.slice(0, 10) === date) {
      acc += cur.salePrice ? parseFloat(cur.salePrice) : 0;
    }
    return acc;
  }, 0);

  const basePrice = productId.reduce((acc, cur) => {
    if (cur.createdAt.slice(0, 10) === date) {
      acc += cur.basePrice ? parseFloat(cur.basePrice) : 0;
    }
    return acc;
  }, 0);
  const bonusAmount = productId.reduce((acc, cur) => {
    if (cur.createdAt.slice(0, 10) === date) {
      acc += cur.bonusAmount ? parseFloat(cur.bonusAmount) : 0;
    }
    return acc;
  }, 0);
  return {
    date,
    orderCount,
    salePrice,
    basePrice,
    bonusAmount
  };
});
const orderTotal = product.reduce((acc, order) => {
  return acc + 1;
}, 0);
const salePriceTotal  = product.reduce((acc, order) => {
  return acc + parseFloat(order.salePrice);
}, 0);
const basePriceTotal  = product.reduce((acc, order) => {
  return acc + parseFloat(order.basePrice);
}, 0);
const bonusAmountTotal  = product.reduce((acc, order) => {
  return acc + parseFloat(order.bonusAmount);
}, 0);

  return (
    <div>
      <NavLink to='/app/orders/add'  className={classes.link} >
      <Button variant="contained" color="primary">ADD Order</Button>
      </NavLink>
      <Grid container justifyContent="center"  className={classes.centerGrid}>
      <Paper className={classes.paper} variant="outlined" >
      <Grid container spacing={2} >
        {usersId.code!='Staff' &&<Grid item  lg={3} md={4} sm={6} xs={12} >
        <Autocomplete
          className={classes.fontText}
          options={users}
          fullWidth
          onChange={(event, value) => setSelectUser(value)}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(users) => users.name}
          renderInput={(params) => <TextField {...params} label="Select an User" variant="outlined" />}
        />
        </Grid>}
        <Grid item  lg={3} md={4} sm={6} xs={12} >
        <Autocomplete
          className={classes.fontText}
          options={games}
          fullWidth
          onChange={(event, value) => setSelectGame(value)}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(games) => games.name}
          renderInput={(params) => <TextField {...params} label="Select a Game an User" variant="outlined" />}
        />
        </Grid>
          <Grid item  lg={3} md={4} sm={6} xs={12} >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker 
              format="dd/MM/yyyy"
            className={classes.formControl}      
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}          
                slotProps={{
                  textField: ({ position }) => ({
                    label: position === 'start' ? 'From' : 'To',
                    helperText: 'dd/mm/yyyy',
                  }),
                  fieldSeparator: { children: 'to' } 
              }}
            />
    </LocalizationProvider>    
          </Grid>  

        </Grid>
        </Paper>
      </Grid>
      <div className={classes.centerGrid}>
      <Paper className={classes.paper2} variant="outlined" >          
      <Grid container spacing={0} >
      {usersId.code==='Staff' &&  <Grid item xs={3}>
          <ListItem >
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={`/images/${usersId.avatarUrl}`} />
                </ListItemAvatar>
                <ListItemText primary={usersId.name} secondary={usersId.code}  />
              </ListItem>
        </Grid>}
        {usersId.code!=='Staff' && selectUser &&<Grid item xs={3}>
           <ListItem >
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={`/images/${selectUser.avatarUrl}`} />
                </ListItemAvatar>
                <ListItemText primary={selectUser.name} secondary={selectUser.code}  />
              </ListItem>
        </Grid>}
        {usersId.code!=='Staff' && selectGame &&<Grid item xs={3}>
           <ListItem >
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={`/images/${selectGame.image}`} />
                </ListItemAvatar>
                <ListItemText primary={selectGame.name} secondary={selectGame.description}  />
              </ListItem>
        </Grid>}
      </Grid>
{!(selectUser || selectGame && usersId.code!='Staff') &&<Typography color='primary' className={classes.name}>General Report for all users and all games</Typography>}

      <Divider className={classes.divider}/>
      <div className={classes.grid}>
      <Grid container spacing={1} >
        <Grid item xs={2}><Typography className={classes.texttotal}>Date Range</Typography></Grid>
        <Grid item xs={2}><Typography className={classes.texttotal}>Orders</Typography></Grid>
        <Grid item xs={2}><Typography className={classes.texttotal}>Sales</Typography></Grid>
        <Grid item xs={2}><Typography className={classes.texttotal}>Revenue</Typography></Grid>
        <Grid item xs={2}><Typography className={classes.texttotal}>Total Bonus</Typography></Grid>
        <Grid item xs={2}><Typography className={classes.texttotal}>Total Revenue</Typography></Grid>
      </Grid>  
      <Grid container spacing={1}>
        <Grid item xs={2}><Typography variant="subtitle1" >{`${fromDate+` - `+toDate}`}</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle1">{orderTotal}</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle1">{number.format(salePriceTotal)} ₫</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle1">{number.format(salePriceTotal-basePriceTotal)} ₫</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle1">{number.format(bonusAmountTotal)} ₫</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle1">{number.format(salePriceTotal-basePriceTotal-bonusAmountTotal)} ₫</Typography></Grid>
      </Grid>   
      </div>     
      </Paper>
      
      </div>
      {Message && 
      <div className={classes.center}>
      <CircularProgress />
      </div>
      }
      {result.length>0 &&<TableContainer component={Paper}>
      <Table className={classes.table}  aria-label="a dense table">
        <TableHead>
          <TableRow>
          <TableCell>Order Date</TableCell>
          <TableCell>Total Orders</TableCell>
          <TableCell>Sales</TableCell>
          <TableCell>Revenue</TableCell>
          <TableCell>Total Bonus</TableCell>
          <TableCell>Total Revenue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.map((row,id) => { 
            var dateCreate = row.date.split("-");
            var dateCreateAt= dateCreate[2]+'/'+dateCreate[1]+'/'+dateCreate[0]
            return(
            <TableRow key={id}>
            <TableCell >{dateCreateAt}</TableCell>
            <TableCell >{number.format(row.orderCount)} ₫</TableCell>
            <TableCell >{number.format(row.salePrice)} ₫</TableCell>
            <TableCell >{number.format(Number(row.salePrice)-Number(row.basePrice))} ₫</TableCell>
            <TableCell >{number.format(row.bonusAmount)} ₫</TableCell>
            <TableCell >{number.format(Number(row.salePrice)-Number(row.basePrice)-Number(row.bonusAmount))} ₫</TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>

    </TableContainer>}
    

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

paper2: {
  flexGrow: 1,
  margin: 'auto',
  [theme.breakpoints.down("sm")]:{
  height: 'auto',
}, 
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
    borderColor:'rgba(0, 0, 0, 0.23)',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink':{
    transform: 'translate(14px, -9px) scale(0.75)',
  },
  '& .MuiFormHelperText-root':{
    marginLeft:'5px'
  },
},
name:{
  fontWeight:500,
  fontSize:'16px',
  margin: theme.spacing(2,0,1,2),
},
divider:{
  margin: theme.spacing(0,2,0,2),  
},
texttotal:{
  color:'#546e7a',
  fontWeight:500,
  fontSize:'16px',
},
grid:{
  margin: theme.spacing(1,0,1,2),
},
}));
