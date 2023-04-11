import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import { Avatar, Typography } from '@material-ui/core';
import {NavLink} from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import MoneyIcon from '@material-ui/icons/Money';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CalculateIcon from '@mui/icons-material/Calculate';

export default function Sidebar() {
  const classes = useStyles();
return (
  <div className={classes.root}>
    <div className={classes.avtconter}>
      <Avatar src='' className={classes.large}/>
    </div>
    <div className={classes.textconter}>
      <Typography  variant="h4" className={classes.textname2}>Huynh The Vien</Typography>
    </div>
    <div className={classes.textconter}>
      <Typography  variant="h5"  className={classes.textname}>Admin</Typography>
    </div>

<Divider />

<div className={classes.roott}>
<List>
<NavLink to='/app/reports' className={classes.link} >
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <AssessmentIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Reports</Typography>
        </ListItem>
      </NavLink>
      <NavLink to='/app/games' className={classes.link} >
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <SportsEsportsIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Games</Typography>
        </ListItem>
      </NavLink>
      <NavLink to='/app/wallets' className={classes.link}>
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <CreditCardIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Wallets</Typography>
        </ListItem>
        </NavLink>
      <NavLink to='/app/clients' className={classes.link} >
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <SupervisedUserCircleIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Clients</Typography>
        </ListItem>
      </NavLink>
      <NavLink to='/app/payments' className={classes.link}>
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Payments</Typography>
        </ListItem>
        </NavLink>
      <NavLink to='/app/transactions' className={classes.link} >
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <MoneyIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Transactions</Typography>
        </ListItem>
      </NavLink>
      <NavLink to='/app/orders' className={classes.link}>
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <ShoppingCartIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Orders</Typography>
        </ListItem>
        </NavLink>
      <NavLink to='/app/users' className={classes.link} >
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <PersonIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Users</Typography>
        </ListItem>
      </NavLink>
      <NavLink to='/app/calculator' className={classes.link} >
        <ListItem button className={classes.listitem}>
          <ListItemIcon className={classes.item}>
            <CalculateIcon />
          </ListItemIcon>
          <Typography className={classes.text}>Calculators</Typography>
        </ListItem>
      </NavLink>
</List>
</div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  textname:{
    fontWeight:500,
    color:'#546e7a',
    fontSize:'16px',
    padding:theme.spacing(0, 0,2,0),

  },
  textname2:{
    fontWeight:500,
    fontSize:'20px',

  },
  avtconter:{
    display: 'flex',
    justifyContent:'center',
    padding:theme.spacing(2, 0,1,0),
    alignItems:'center',
    // padding: theme.spacing(2, 10),
  },
  large:{
    width: theme.spacing(8),
    height: theme.spacing(8),
    
  },
  textconter:{
    justifyContent:'center',
    display:'flex',
    alignItems:'center',
  },

  imgavatar:{
    cursor:'pointer',
  },
  colorToolbar:{
    backgroundColor: '#3f50b5',
    borderRight:`1px solid #3f50b5`,
  }, 
  roott: {
    width: '95%',
    color:'#546e7a',
    padding: theme.spacing(0,0,0,2),
    maxWidth: 360,
    backgroundColor: theme.palette.background.hover,
  },
  item:{
    color:"inherit",
    borderRadius:'20px',
  },
  link:{
    color:'inherit',
    textDecoration:'none',
    '&.active > div':{
        color:theme.palette.primary.main,
    }
  },
  text:{
    fontWeight:500,
    marginLeft: '-25px',
    padding:'20xp',
    fontSize:'15px',
  },
  listitem:{
    padding:'10px 8px',
    borderRadius:'4px',
    fontSize:'16px',
  },
}));