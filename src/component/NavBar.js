import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'
import Slick from './Slick'
import $ from 'jquery';

class NavBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            productlines: []
        }
    }
    componentDidMount(){
        // go get all productlines from the database
        // hostAddress variable is set up in index.html as a script tag in the body
        $.getJSON(window.hostAddress+'/productlines/get',(productlinesData)=>{
            console.log(productlinesData);
            this.setState({
                productlines: productlinesData
            })
        })
    }

  render(){
        // temp var to serve our link
      const shopMenu = [];
      // map through this.state.productlines. First render, will not loop (because
      // pl is an object of 'this.state.productlines' which is an empty array
      this.state.productlines.map((pl,index)=>{
          shopMenu.push(
              <Link key={index} to={`/shop/${pl.link}`}>{pl.productLine}</Link>
          )
      });



    return(
    	<div>
			<nav className="navbar navbar-default navbar-fixed-top">
			  <div className="container-fluid navbar-white">
			    <ul className="nav navbar-nav">
			    	<li><Link to="/">Home</Link></li>
			      	<li className="dropdown">
			      		<Link to="/shop"><i className="arrow down" /> Shop</Link>
						<ul>
							<li className="dropdown-links">
                                {/*the links were all hardcoded here. we created an array above in shopMenu and */}
                                {/*dropped that in here*/}
                                {shopMenu}
							</li>
						</ul>
			      	</li>
			      	<li><Link to="/about">About Us</Link></li>
			      	<li><Link to="/contact">Contact Us</Link></li>
			    </ul>
			  </div>
			  <div className="container">
			    <div className="navbar-header">
			    	<Link to="/" className="navbar-brand">ClassicModels</Link>
			    </div>
				   <ul className="nav navbar-nav float-right">
				      <li className="text-right"><Link to="/login">Login</Link></li>
				      <li className="text-right"><Link to="/register">Register</Link></li>
				      <li className="text-right"><Link to="/cart">(0) items in your cart | ($0.00)</Link></li>
				   </ul>
			  </div>
			</nav>
	        <Route exact path="/" component={Slick} />
        </div>
	)
  }
}

export default NavBar;