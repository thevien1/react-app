import { Divider, Grid, Typography } from '@material-ui/core'
import React, { useEffect,useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import NP from 'number-precision'
import axios from '../Api/axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Tabtitle } from '../Login/Title';

const DetaiGames = () => {
  Tabtitle('Detail game')
const classes = useStyles();
const { id } = useParams();
const [games,setGames] = useState([])
const [budgets,setBudgets] = useState([])
const [wallets,setWallets] = useState([])
useEffect(() => {
  Promise.all(
    [
      axios.get(`?get_games_id=${id}`),
      axios.get(`?get_games_budgetId=${id}`),  
      axios.get(`?get_games_walletId=${id}`),  
    ])
    .then(results => {
      const [gameId,budgets,wallets] = results.map(res => res.data);
      setGames(gameId);
      setBudgets(budgets)
      setWallets(wallets)
    }).catch(error => console.error(error));
}, [id]);
const uniqueBudgets = budgets.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i);
const uniqueBudgetsWallets = wallets.filter((v,i,a)=>a.findIndex(t=>(t.walletsName === v.walletsName))===i);
const uniqueWallets = budgets.filter((v,i,a)=>a.findIndex(t=>(t.walletsPrice === v.walletsPrice))===i);

const totalBudget = uniqueBudgets.map((item)=>{
  const totalusedQuantity = budgets.reduce((acc, cur) => {
    if (cur.name=== item.name) {
      acc += cur.totalAmount ? parseFloat(cur.totalAmount) : 0;
    }
    return acc;
  }, 0);
  return {
    name: item.name,
    budgetsPrice: item.budgetsPrice,
    totalusedQuantity
  };
})
const totalWallet = uniqueWallets.map((item)=>{
  const totalusedAmount = budgets.reduce((acc, cur) => {
    if (cur.walletsPrice=== item.walletsPrice) {
      acc += cur.totalAmount ? parseFloat(cur.totalAmount) : 0;
    }
    return acc;
  }, 0);
  const totalusedQuantity = budgets.reduce((acc, cur) => {
    if (cur.walletsPrice=== item.walletsPrice) {
      acc += cur.usedQuantity ? parseFloat(cur.usedQuantity) : 0;
    }
    return acc;
  }, 0);
  const totalName= budgets.reduce((acc, cur) => {
    if (cur.walletsPrice=== item.walletsPrice) {
      acc = cur.name ;
    }
    return acc;
  }, 0);
  return {
    name: totalName,
    budgetsPrice: item.walletsPrice,
    totalusedQuantity,
    totalusedAmount
  };
})

let number = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});
let numbers = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});
return (
    <div>
      <Typography color='primary' className={classes.name} variant='h4'>Detail game</Typography>
      <Grid container spacing={1}>
        <Grid item xs={2}>
        <Typography variant='h6'color='primary' >Name:</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{games.name}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={2}>
        <Typography variant='h6'color='primary'>Description:</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{games.description}</Typography>
        </Grid>
      </Grid>
      <Divider style={{backgroundColor:'#000',margin:'10px 0px'}}/>
      <Grid container spacing={1}>
        <Grid item xs={2}>
        <Typography variant='h6'color='primary'>Budgets statistical:</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Budget name</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Remain quantity</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Price</Typography>
        </Grid>
      </Grid>
      {totalBudget.map((item,keyId)=>{
        if(item.totalusedQuantity!='0'){
        return(
        <Grid container spacing={1} key={keyId}>
        <Grid item xs={2}>
        <Typography variant='h6'color='primary'></Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{item.name}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{NP.round(item.totalusedQuantity,2)}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{number.format(item.budgetsPrice)} ₫</Typography>
        </Grid>
      </Grid>
        )}
      })}
      <Divider style={{backgroundColor:'#000',margin:'10px 0px'}}/>
      <Grid container spacing={1}>
        <Grid item xs={2}>
        <Typography variant='h6'color='primary'>Total:</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Package name</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Total</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Total Price</Typography>
        </Grid>
      </Grid>
      {totalWallet.map((item,keyId)=>{
        if(item.totalusedQuantity!='0'){
        return(
        <Grid container spacing={1} key={keyId}>
        <Grid item xs={2}>
        <Typography variant='h6'color='primary' ></Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{item.name}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{NP.round(item.totalusedAmount,2)}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>{number.format(item.totalusedQuantity)} ₫</Typography>
        </Grid>
      </Grid>
        )}
      })}
      <Divider style={{backgroundColor:'#000',margin:'10px 0px'}}/>
      <Accordion  >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.colorSummary}
        >
        <Typography variant='h6'color='primary' className={classes.heading}>Wallets detail</Typography>
        </AccordionSummary>
{uniqueBudgetsWallets.map((item,keyId)=>{
  return(
    <div key={keyId}>
    <Grid container spacing={1} >
        <Grid item xs={2}>
        <Typography variant='h6'color='primary'>Wallets:</Typography>
        </Grid>
        <Grid item xs={5}>
        <Typography variant='subtitle1' color='primary' className={classes.textdau1}>Wallet name: {item.walletsName}</Typography>
        </Grid>
        <Grid item xs={3}>
        <Typography variant='subtitle1' className={classes.text}>Remain packages: {item.packages}</Typography>
        <Typography variant='subtitle1' className={classes.text}>Price: {number.format(item.walletsPrice)+' ₫'}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={5} >
                <Grid item xs={2}>
                    <Typography variant='h5'color='primary' className={classes.textdau1}></Typography>
                    </Grid>
                    <Grid item xs={3}>
                    <Typography variant='subtitle1'className={classes.text}>Budget name</Typography>
                    </Grid>
                    <Grid item xs={3}>
                    <Typography variant='subtitle1'className={classes.text}>Remain quantity</Typography>
                    </Grid>

                    <Grid item xs={3}>
                    <Typography variant='subtitle1'className={classes.text}>Price</Typography>    
                    </Grid>
                </Grid>
    {wallets.map((budget,keyBudget)=>{
      if(budget.budgetId==item.walletsId){
      return(
        <Grid container spacing={5} key={keyBudget}>
                <Grid item xs={2}>
                    <Typography variant='h5'color='primary' className={classes.textdau1}></Typography>
                    </Grid>
                    <Grid item xs={3}>
                    <Typography variant='subtitle1'className={classes.text}>{budget.name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                    <Typography variant='subtitle1'className={classes.text}>{budget.budgetsQuantity}</Typography>
                    </Grid>

                    <Grid item xs={3}>
                    <Typography variant='subtitle1'className={classes.text}>{number.format(budget.budgetsPrice)+' ₫'}</Typography>    
                    </Grid>
                </Grid>
      )}
    })}
    {keyId!==uniqueBudgetsWallets.length-1 && 
            <Grid container spacing={2}>
               <Grid item xs={2}>
               </Grid>
               <Grid item xs={10}>
               <Divider style={{backgroundColor:'#000'}}/>
               </Grid>
             </Grid>
             }  
      </div>
  )
})}
        

                
      </Accordion>
    </div>
)
}

export default DetaiGames
const useStyles = makeStyles((theme) => ({
name:{
    fontWeight:500,
    margin: theme.spacing(0,0,3,0),
    textAlign:'center'
},
text:{
    margin:theme.spacing(0.5,0,0,0),
},
heading: {
  fontSize: theme.typography.pxToRem(20),
  fontWeight: 500,
  justifyContent:'center',
  textAlign:'center',
  width:'100%'
},
textdau1:{
  color:'#3f51b5',
  fontWeight:500,
  fontSize:'1rem',
  margin:theme.spacing(1,0,0,0),
},
}))