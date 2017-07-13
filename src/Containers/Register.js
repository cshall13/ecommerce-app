import React, {Component} from 'react';
import {Form, FormGroup, ControlLabel, FormControl, Button, Col} from 'react-bootstrap'
// because this is a container we need connect from react-redux
import {connect} from 'react-redux';
// our action needs bindActionCreators from redux
import {bindActionCreators} from 'redux';

// RegisterAction runs on submission
import RegisterAction from '../actions/RegisterAction'

class Register extends Component{
    constructor(props){
        super(props);
        this.handleRegistration = this.handleRegistration.bind(this);
    }

// this is an internal class/component based function
    handleRegistration(event){
        event.preventDefault();
        console.log("user submitted the form");
        var name = event.target[0].value;
        var email = event.target[1].value;
        var accountType = "customer"
        var password = event.target[3].value;
        var city = event.target[4].value;
        var state = event.target[5].value;
        var salesRep = event.target[6].value;
        console.log(name)
        // this is set up as a single object and we can call it whatever we want in
        //     in the function in 'RegisterAction.js'
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

    render() {
        return (
            <div className="register-wrapper">
                <Form horizontal onSubmit={this.handleRegistration}>
                    <FormGroup controlId="formHorizontalName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Name
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" name="fullName" placeholder="Full Name" />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalName">
                        <Col componentClass={ControlLabel} sm={2}>
                            Email
                        </Col>
                        <Col sm={10}>
                            <FormControl type="text" name="email" placeholder="Email" />
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
// this is not part of the class bc the class itself is a react component
// this is a redux module
function mapDispatchToProps(dispatch){
    return bindActionCreators({
        // the left is the prop, the right is the file
        registerAction: RegisterAction
    },dispatch)

}

export default connect(null,mapDispatchToProps)(Register);