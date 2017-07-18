import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'; //(npm install - - save react-router-dom)
import NavBar from './Containers/NavBar';
import Home from './Containers/Home';
import Register from './Containers/Register';
import Login from './Containers/Login';
import Slick from './component/Slick';
import ProductLine from './Containers/ProductLine';
import Cart from './Containers/Cart';




class App extends Component {
  render() {
    return (
        // router manages url and makes single page app functional
      <Router>
          <div className="App">
              <NavBar/>
              <Route exact path="/" component={Slick} />
              <div className="container main">
                  <Route exact path="/" component={Home} />
                  <Route exact path="/Register" component={Register} />
                  <Route exact path="/Login" component={Login} />
                  <Route path="/shop/:productLine" component={ProductLine} />
                  <Route path="cart" component={Cart} />
              </div>
          </div>
      </Router>
    );
  }
}

export default App;
