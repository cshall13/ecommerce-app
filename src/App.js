import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'; //(npm install - - save react-router-dom)
import NavBar from './component/NavBar';
import Home from './Containers/Home';
import Register from './Containers/Register';



class App extends Component {
  render() {
    return (
      <Router>
          <div className="App">
              <NavBar/>
              <div className="container main">
                  <Route exact path="/" component={Home} />
                  <Route exact path="/Register" component={Register} />
              </div>
          </div>
      </Router>
    );
  }
}

export default App;
