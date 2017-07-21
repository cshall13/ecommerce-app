import React, {Component} from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button, Col ,MenuItem} from 'react-bootstrap'
// Our action needs bindActionCreators from redux
import  {bindActionCreators} from 'redux';
// Get the registerAction function which runs on submission
import RegisterAction from '../actions/RegisterAction';
// Because this is a container, we need connect from react-redux!
import {connect} from 'react-redux';


class Register extends Component{
	constructor(props) {
		super(props);
		this.state = {
			registerMessage: "",
			nameError: null,
			emailError: null,
			formError: false
		}
		this.handleRegistration = this.handleRegistration.bind(this);
	}

	handleRegistration(event){
		event.preventDefault();
		// console.log("User SUbmitted the form!!")
		var name = event.target[0].value
		var email = event.target[1].value
		var accountType = "customer"
		var password = event.target[3].value
		var city = event.target[4].value
		var state = event.target[5].value
		var salesRep = event.target[6].value
		var error = false;

		//Name
		if(name.length < 3){
			var nameError = "error";
			error=true;
		}
		else{
			var nameError = "success"
		}

		//Email
		if(email.length < 3){var emailError = "error"; error=true}
		else{var emailError = "success"}


		// console.log(name);
		if(error){
			this.setState({
				formError: true,
				emailError: emailError,
				nameError: nameError
			})
		}else{
			this.props.registerAction({
				name: name,
				email: email,
				accountType: accountType,
				password: password,
				city: city,
				state: state,
				salesRep: salesRep
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log("=======================")
		console.log(nextProps.registerResponse)
		console.log("=======================")

		if(nextProps.registerResponse.msg === 'userInserted'){
			this.props.history.push('/');
		}else if(nextProps.registerResponse.msg === 'userAlreadyExists'){
			console.log("User name taken!");
			this.setState({
				registerMessage: "Sorry, this username is already taken."
			})
		}
	}

	render(){

		return(
			<div className="register-wrapper">
				<h1>{this.state.registerMessage}</h1>
				<Form horizontal onSubmit={this.handleRegistration}>
					<FormGroup controlId="formHorizontalName" validationState={this.state.nameError}>
						<Col componentClass={ControlLabel} sm={2}>
							Name
						</Col>
						<Col sm={10}>
							<FormControl type="text" name="fullName" placeholder="Full Name" />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName" validationState={this.state.emailError}>
						<Col componentClass={ControlLabel} sm={2}>
							Email
						</Col>
						<Col sm={10}>
							<FormControl type="email" name="email" placeholder="Email" />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName">
						<Col componentClass={ControlLabel} sm={2}>
							Account Type
						</Col>
						<Col sm={10}>
							<FormControl type="text" name="type" value="customer" disabled />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName">
						<Col componentClass={ControlLabel} sm={2}>
							Password
						</Col>
						<Col sm={10}>
							<FormControl type="password" name="password" placeholder="Password" />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName">
						<Col componentClass={ControlLabel} sm={2}>
							City
						</Col>
						<Col sm={10}>
							<FormControl type="text" name="city" placeholder="City" />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName">
						<Col componentClass={ControlLabel} sm={2}>
							State
						</Col>
						<Col sm={10}>
							<FormControl type="text" name="state" placeholder="State" />
						</Col>
					</FormGroup>
					<FormGroup controlId="formHorizontalName">
						<Col componentClass={ControlLabel} sm={2}>
							Sales Rep
						</Col>
						<Col sm={10}>
							<FormControl type="text" name="employee" placeholder="Employee you worked with" />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button bsStyle="primary" bsSize="small" type="submit">
								Register
							</Button>
						</Col>
					</FormGroup>
				</Form>
			</div>
		)
	}
}

function mapStateToProps(state){
	return{
		registerResponse: state.registerReducer
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		registerAction: RegisterAction
	}, dispatch)
}

// export default Register;
export default connect(mapStateToProps,mapDispatchToProps)(Register);