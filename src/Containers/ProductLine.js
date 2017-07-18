import React, {Component} from 'react';
import $ from'jquery';
import ProductTableRow from '../component/ProductTableRow';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import UpdateCart from '../actions/UpdateCart';

class ProductLine extends Component{
    constructor(props){
        super(props);
        this.state = {
            productList: [],
            whichWay: true
        };
        // make the right 'this' available to our member
        this.sortTable = this.sortTable.bind(this);
        this.getProducts = this.getProducts.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.getProducts(nextProps);
    }

    componentDidMount(){
        this.getProducts(this.props);
    }

    getProducts(newProps){
        // console.log(this.props.match)
        const pl = newProps.match.params.productLine;
        // console.log(pl);
        // understood this is a get request '/get' is optional here
        const url = window.hostAddress + `/productlines/${pl}/get`
        $.getJSON(url,(data)=>{
            console.log(data);
            this.setState({
                productList: data
            })
        })
    }

    sortTable(columnName){
        console.log(columnName);

        var productList = this.state.productList.slice();

        productList.sort((a,b)=>{
            var textA = a[columnName];
            var textB = b[columnName];
            // this is our compare function
            // ternary statement, after ? if true, after : if false

            if(this.state.whichWay){
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }else {
                return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
            }
        });

        this.setState({
            productList: productList
        })
    }

    render(){

        var productTableArray = [];
        this.state.productList.map((product, index)=>{
            productTableArray.push(
                <ProductTableRow
                    key={index}
                    product={product}
                    addToCart={this.props.updateCart}
                />)
        });

        if(this.state.productList.length === 0){
            var textHeader = ""
        }else{
            var textHeader = this.state.productList[0].productLine
        }

        return(
            <div>
                <h1 className="pl-header">{textHeader}</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="table-head" onClick={()=>{this.sortTable("productName")}}>Product Name</th>
                            <th className="table-head" onClick={()=>{this.sortTable("productScale")}}>Model Scale</th>
                            <th className="table-head" onClick={()=>{this.sortTable("productVendor")}}>Made By</th>
                            <th className="table-head" onClick={()=>{this.sortTable("productDescription")}}>Description</th>
                            <th className="table-head" onClick={()=>{this.sortTable("quantityInStock")}}>In Stock</th>
                            <th className="table-head" onClick={()=>{this.sortTable("buyPrice")}}>Your Price</th>
                            <th className="table-head" onClick={()=>{this.sortTable("MSRP")}}>MSRP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productTableArray}
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        loginInfo: state.registerReducer
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        updateCart: UpdateCart
    },dispatch)
}

// export default ProductLine;
export default connect(mapStateToProps, mapDispatchToProps)(ProductLine);