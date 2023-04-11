import { Button, Grid, Paper,TextField,Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Tabtitle } from '../Login/Title';


const Calculator = () => {
Tabtitle('Calculator')
  const classes = useStyles();
  const [result, setResult] = useState(0);
  const [input, setInput] = useState("");
  const [inputOne, setInputOne] = useState('');
  const [operKey, setOperKey] = useState('');
  const [inputTwo, setInputTwo] = useState('');
  const [done, setDone] = useState('');
 
  const handleNumberClick = (number) => {
    if (operKey === '') {
      setInputOne(inputOne + number);
    } else {
      setInputTwo(inputTwo + number);
    }
  };
    
  const handleOperatorClick = (operator) => {
    if (operator !== '=') {
      setOperKey(operator);
    } else {
      const tempResult = eval(`${inputOne} ${operKey} ${inputTwo}`);
      setDone(tempResult);
      setInputOne(tempResult);
      setInputTwo('');
      setOperKey('');
    }
  }
  
  const handleClearClick = () => {
    setResult(0);
    setInput("");
    setDone("");
    setInputTwo("");
    setInputOne("");
    setOperKey("");
  }

  const handleKeyDown = (event) => {
    const key = event.key;
    if (/\d/.test(key)) {
      handleNumberClick(key);
    } else if (/\+|-|\*|\//.test(key)) {
      handleOperatorClick(key);
    } else if (key === "=" || key === "Enter") {
      handleOperatorClick("=");
    } else if (key === "Delete") {
      handleClearClick();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputOne, inputTwo, operKey, done]);

  return (
    <div>
        <div className={classes.paper}>
        <Typography className={classes.name} color='primary' >Calculator</Typography>
        </div>
        <Paper className={classes.paper} variant="outlined">
            <div className={classes.result2}>  
            <Typography autoComplete="off"  className={classes.result} variant="h6">{inputOne}{operKey} {inputTwo}</Typography>
            <Typography autoComplete="off"  className={classes.result} variant="h6">{done}</Typography>
            </div>

        <form autoComplete="off">  
        <div className={classes.main}>  
            <TextField type='number' className={classes.number} name='number' size="small" variant="outlined"/>
            <Button size="small" className={classes.buttonC} onClick={() => handleClearClick()}  variant="outlined">C</Button>
        </div>
        <div className={classes.buttonKeys}>
            
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("1")} variant="outlined">1</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("2")} variant="outlined">2</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("3")} variant="outlined">3</Button>
        <Button size="small" className={classes.button} onClick={() => handleOperatorClick("+")} variant="outlined">+</Button>  
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("4")}  variant="outlined">4</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("5")} variant="outlined">5</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("6")} variant="outlined">6</Button>
        <Button size="small" className={classes.button} onClick={() => handleOperatorClick("-")} variant="outlined">-</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("7")} variant="outlined">7</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("8")} variant="outlined">8</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("9")} variant="outlined">9</Button>
        <Button size="small" className={classes.button} onClick={() => handleOperatorClick("*")} variant="outlined">*</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick(".")} variant="outlined">.</Button>
        <Button size="small" className={classes.button} onClick={() => handleNumberClick("0")} variant="outlined">0</Button>
        <Button size="small" className={classes.button} onClick={() => handleOperatorClick("=")} variant="outlined">=</Button>
        <Button size="small" className={classes.button} onClick={() => handleOperatorClick("/")} variant="outlined">/</Button>
        </div>
        </form>
      
        </Paper>
    </div>
  )
}

export default Calculator

const useStyles = makeStyles((theme) => ({
paper: {
    maxWidth: 310,
    margin: `auto`, 
},
margin: {
    margin: theme.spacing(1),
},
name:{
    fontWeight:500,
    fontSize:'29px',
    margin: theme.spacing(1),
    textAlign:'center',
    justifyContent:'center',
},
main:{
    margin: theme.spacing(1,1),  
    display:'flex',
},
button:{
   height:'40px',
   margin: theme.spacing(1,1,0,0),    
},
buttonC:{
    height:'40px',   
},
number:{
    margin: theme.spacing(0,1,0,0),     
},
buttonKeys:{
    margin: theme.spacing(3,1),         
},
result2:{
height: 70,
},
result:{
textAlign:'right'
},
}));
  