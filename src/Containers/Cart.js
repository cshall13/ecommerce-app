import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GetCart from '../actions/GetCart';
import ProductTableRow from '../component/ProductTableRow';


class Cart extends Component{

    componentDidMount(){
        if(this.props.loginInfo.token !== undefined){
            this.props.getCart(this.props.loginInfo.token)
        }else{

        }
    }

    render(){
        var cartArray = [];
        this.props.cartInfo.products.map((product,index)=>{
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


        console.log(this.props.cartInfo);
        return(
            <div>
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