import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import $ from 'jquery'
import {connect} from 'react-redux'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import Cart from 'react-icons/lib/fa/shopping-cart'

class NavBar extends Component{
	constructor(props) {
		super(props);
		this.state = {
			productlines: []
		}
	}

	// when you need something on-load, use componentDidMount
	componentDidMount() {
		// go get all productlines from the DB.
		$.getJSON(window.hostAddress+'/productlines/get',(productlinesData)=>{
			// console.log(productlinesData);
			this.setState({
				productlines: productlinesData
			});
		});
	}

  render(){
		console.log(this.props.cartInfo);
	  if(this.props.cartInfo != undefined){
			var totalPrice = this.props.cartInfo.totalPrice;
			var totalItems = this.props.cartInfo.totalItems;
	  }else{
	  	var totalPrice = 0;
	  	var totalItems = 0;
	  }
  	// Temp var to store our <link>
  	const shopMenu = [];
  	// Map through this.state.productlines. First render, will not loop (because array is empty)
  	this.state.productlines.map((pl,index)=>{
  		// console.log(pl);
  		shopMenu.push(
  			<MenuItem key={index} to={`/shop/${pl.link}`}>{pl.productLine}</MenuItem>
  		)
  	})
	
	if(this.props.registerInfo.name === undefined){
		var rightBar = [
			<NavItem >
				<Link to="/login">Sign in</Link>
			</NavItem>,
			<NavItem >
				<Link to="/register">Register</Link>
			</NavItem>,
			<NavItem >
				<Link to="/cart"><Cart size={24} /></Link> 0 items | $0
			</NavItem>
		]
	}else{
		var rightBar = [
			<NavItem >
				Welcome, {this.props.registerInfo.name}
			</NavItem>,
			<NavItem >
				<a href="http://localhost:3001/">Log Out</a>
			</NavItem>,
			<NavItem >
				<Link to="/cart"><Cart size={24} />&nbsp;{totalItems} items | ${totalPrice}</Link>
			</NavItem>
		]		
	}

    return(
    	<div>
			<Navbar inverse collapseOnSelect fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to="/">ClassicModels</Link>
					</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							<NavItem eventKey={1}>
								<Link to="/about">About Us</Link>
							</NavItem>
							<NavItem eventKey={2}>
								<Link to="/contact">Contact Us</Link>
							</NavItem>
							<NavDropdown eventKey={3} title="Shop" id="basic-nav-dropdown">
								{shopMenu}
							</NavDropdown>
						</Nav>
						<Nav pullRight>
						{rightBar}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
	      {/*<Route exact path="/" component={Slick} />*/}
      </div>
	)
  }
}

function mapStateToProps(state){
	return{
		registerInfo: state.registerReducer,
		cartInfo: state.cartReducer
	}
}

// export default NavBar
export default connect(mapStateToProps)(NavBar)