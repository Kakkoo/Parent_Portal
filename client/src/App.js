
import React, { Component } from "react";
import { Provider } from "react-redux";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import ForgotPassword from "./components/auth/ForgotPassword";
import jwt_decode from "jwt-decode";
import { logoutUser } from "./actions/authActions";
import setAuthToken from "./utils/setAuthToken";
import { SET_USER } from "./actions/types";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import "./App.css";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import AssignedWork from './components/dashboard/AssignedWork';
import AddChildren from './components/dashboard/AddChildren';
import store from "./store";
if (localStorage.jwtToken) {
  //decode
  const decoded = jwt_decode(localStorage.jwtToken);
  //check the expiry of the token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //Expired
    //Logout user
    store.dispatch(logoutUser());
    //Redirect user to login
    window.location.href = "/login";
  }

  //Set auth header
  setAuthToken(localStorage.jwtToken);
  //dispatch
  store.dispatch({
    type: SET_USER,
    payload: decoded,
  });
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgotpassword" component={ForgotPassword} />
            <Switch>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/addchildren" component={AddChildren} />
              <Route exact path="/assignedwork" component={AssignedWork} />

            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;

