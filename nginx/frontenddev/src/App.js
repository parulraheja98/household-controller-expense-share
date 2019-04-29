import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './components/Register.js';
import Login from './components/Login.js';
import BillPayment from './components/BillPayment';
import {Switch } from 'react-router';
import {BrowserRouter,Route} from 'react-router-dom';
import CreateHousehold from './components/CreateHousehold';
import ListHousehold from './components/ListHousehold';
import Check from './components/Check.js';
import Invite from './components/Invite.js';
import Message from './components/Message';
import Verification from './components/Verification.js';
import Logout from './components/Logout.js';
import PaymentInfo from './components/PaymentInfo';
import DisplayPayments from './components/DisplayPayments';
import NavigationBar from './components/NavigationBar';
import IndividualPayment from './components/IndividualPayment';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import ResetLink from './components/ResetLink';
import PaymentTransaction from './components/PaymentTransaction';
import PaymentDetails from './components/PaymentDetails';
import {withRouter} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        <NavigationBar checking={this.logout}/>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/billpayment' component={BillPayment} />
          <Route exact path='/createhousehold' component={CreateHousehold} />
          <Route exact path='/listofhouseholds' component={ListHousehold} />
          <Route exact path='/check' component={Check} />
          <Route exact path='/invite/:household' component={Invite} />
          <Route exact path='/message' component={Message} />
          <Route exact path='/verificationtoken/:token/:household' component={Verification} />
          <Route exact path='/logout' component={Logout} />
          <Route exact path='/paymentinfo' component={PaymentInfo} />
          <Route exact path='/individualpayment' component={IndividualPayment} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/forgotpassword' component={ResetPassword} />
          <Route exact path='/verifylink/:id' component={ResetLink} />
          <Route exact path='/billpayment/:household' component={PaymentTransaction} />
          <Route exact path='/memberinfo/:paymentId' component={PaymentDetails} />
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
