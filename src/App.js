import React, { Component } from 'react';
import './App.css';
import {BroswerRouter as Router, Toute, Link} from 'react-router-dom'; //(npm install - - save react-router-dom)
import NavBar from './component/NavBar';
import Home from './Containers/Home';
import Register from './Containers/Register';



class App extends Component {
  render() {
    return (
      <div className="App">
        <Home />
      </div>
    );
  }
}

export default App;
