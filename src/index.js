import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme } from '@material-ui/core'
import { ThemeProvider } from "@emotion/react";
const root = ReactDOM.createRoot(document.getElementById('root'));
const themecolor = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#d32f2f',
      main: '#d32f2f',
      dark: '#d32f2f',
      contrastText: '#000',
    },
  },
});
root.render(
  <React.StrictMode>
    <ThemeProvider theme={themecolor} >
      
      <App />
      </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
