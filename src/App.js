
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Login/Dashboard"
import Login from "./Login/Login"
import Users from './Main/Users';
import Games from './Main/Games';
import Wallets from './Main/Wallets';
import NoPage from './Main/NoPage';
import AddUsers from './Add/AddUsers';
import AddGames from './Add/AddGames';
import EditUsers from './Edit/EditUsers';
import EditGames from './Edit/EditGames';
import Clients from './Main/Clients';
import AddWallets from './Add/AddWallets';
import EditWallets from './Edit/EditWallets';
import DetailWallets from './Edit/DetailWallets';
import AddClients from './Add/AddClients';
import EditClients from './Edit/EditClients';
import AddTransactions from './Add/AddTransactions';
import Transactions from './Main/Transactions';
import Payments from './Main/Payments';
import AddPayments from './Add/AddPayments';
import EditPayments from './Edit/EditPayments';
import Withdraw from './Edit/Withdraw';
import Orders from './Main/Orders';
import AddOrders from './Add/AddOrders';
import Test from './Main/Test';
import DetaiOrders from './Edit/DetaiOrders';
import Reports from './Main/Reports';
import Calculator from './Main/Calculator';
import DetaiGames from './Edit/DetaiGames';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login/>} />
        <Route path="*" element={<NoPage/>}/>
        <Route path="/" element={<Dashboard/>} > 
          <Route path="/app/users" element={<Users/>}/>
          <Route path="/app/games" element={<Games/>}/>
          <Route path="/app/wallets" element={<Wallets/>}/>
          <Route path="/app/clients" element={<Clients/>}/>
          <Route path="/app/payments" element={<Payments/>}/>
          <Route path="/app/transactions" element={<Transactions/>}/>
          <Route path="/app/orders" element={<Orders/>}/>
          <Route path="/app/reports" element={<Reports/>}/>
          <Route path="/app/calculator" element={<Calculator/>}/>
          <Route path="/app/test" element={<Test/>}/>

          <Route path="/app/users/add" element={<AddUsers/>}/>
          <Route path="/app/users/edit/:id" element={<EditUsers/>}/>
          <Route path="/app/games/add" element={<AddGames/>}/>
          <Route path="/app/games/edit/:id" element={<EditGames/>}/>
          <Route path="/app/games/:id" element={<DetaiGames/>}/>
          <Route path="/app/wallets/add" element={<AddWallets/>}/>
          <Route path="/app/wallets/edit/:id" element={<EditWallets/>}/>
          <Route path="/app/wallets/:id" element={<DetailWallets/>}/>
          <Route path="/app/clients/add" element={<AddClients/>}/>
          <Route path="/app/clients/edit/:id" element={<EditClients/>}/>
          <Route path="/app/transactions/add" element={<AddTransactions/>}/>
          <Route path="/app/payments/add" element={<AddPayments/>}/>
          <Route path="/app/payments/edit/:id" element={<EditPayments/>}/>
          <Route path="/app/payments/:id" element={<Withdraw/>}/>
          <Route path="/app/orders/add" element={<AddOrders/>}/>
          <Route path="/app/orders/:id" element={<DetaiOrders/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
