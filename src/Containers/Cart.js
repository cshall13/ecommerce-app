import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GetCart from '../actions/GetCart';
import ProductTableRow from '../component/ProductTableRow';
import $ from 'jquery';
import {Link} from 'react-router-dom';


class Cart extends Component{
    constructor(props){
        super(props);
        this.makePayment = this.makePayment.bind(this);
    }

    componentDidMount(){
        if(this.props.loginInfo.token !== undefined){
            this.props.getCart(this.props.loginInfo.token)
        }else{

        }
    }

    makePayment() {
        var handler = window.StripeCheckout.configure({
            key: 'pk_test_QQmahuQL0QUgjAheFobNmmvW',
            locale: 'auto',
            token: (token) => {
                console.log(token)
                var theData = {
                    amount: this.props.cartInfo.totalPrice * 100,
                    stripeToken: token.id,
                    userToken: this.props.loginInfo.token,
                }
                $.ajax({
                    method: 'POST',
                    url: window.hostAddress+'/stripe',
                    data: theData
                }).done((data) => {
                    console.log(data);
                    if (data.msg === 'paymentSuccess') {
                        this.props.history.push('/thank-you');
                    }
                });
            }
        });
        handler.open({
            name: "Pay Now",
            description: 'Pay Now',
            amount: this.props.cartInfo.totalPrice * 100
        })
    }

    render(){

        if(this.props.cartInfo.products === undefined){
            return(
                <div>
                    <h3 className="cart-message">
                        Your cart is empty. Get shopping or <Link to="/login">Login.</Link>
                    </h3>
                </div>
            )
        }

        var cartArray = [];
        console.log(this.props.cartInfo);
        if(this.props.cartInfo.products != undefined) {
            this.props.cartInfo.products.map((product, index) => {
                console.log(product)
                cartArray.push(
                    <ProductTableRow
                        key={index}
                        product={product}
                        addToCart={null}
                        loggedIn={false}
                        token={null}
                    />
                )
            });
        }

        console.log(this.props.cartInfo);
        return(
            <div>
                <div className="pay-now">
                    Your order total is: ${this.props.cartInfo.totalPrice}
                    <button className="btn btn-primary" onClick={this.makePayment}>
                    </button>
                </div>
                {cartArray}
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        loginInfo: state.registerReducer,
        cartInfo: state.cartReducer
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        getCart: GetCart
    },dispatch)
}

export default connect (mapStateToProps, mapDispatchToProps)(Cart)