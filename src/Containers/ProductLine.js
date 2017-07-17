import React, {Component} from 'react';
import $ from'jquery';

class ProductLine extends Component{
    constructor(props){
        super(props);
        this.state = {
            productList: []
        }
    }

    componentDidMount(){
        // console.log(this.props.match)
        const pl = this.props.match.params.productLine;
        // console.log(pl);
        // understood this is a get request '/get' is optional here
        const url = window.hostAddress + `/productlines/${pl}/get`
        console.log(url);
        $.getJSON(url,(data)=>{
            console.log(data);
            this.setState({
                productList: data
            })
        })
    }

    sortTable(columnName){

    }

    render(){

        var productTableArray =[];
        this.state.productList.map((product, index)=>{
           if(product.quantityInStock > 100) {
               var inStockClass = "";
               var inStock = "In Stock!"
           }else if(product.quantityInStock > 0){
               var inStockClass = "bg-warning";
               var inStock = 'Order Soon!'
           }else{
               var inStockClass = "bg-danger";
               var inStock = 'Out of Stock!'
           }
            productTableArray.push(
               <tr key={index}>
                   <td>{product.productName}</td>
                   <td>{product.productScale}</td>
                   <td>{product.productVendor}</td>
                   <td>{product.productDescription}</td>
                   <td className={inStockClass}>{inStock}</td>
                   <td>{product.buyPrice}</td>
                   <td>{product.MSRP}</td>
               </tr>
           )
        });
        return(
            <div>
                <h1>{this.props.match.params.productLine}</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="table-head" onClick={()=>{this.sortTable("name")}}>Product Name</th>
                            <th className="table-head" onClick={()=>{this.sortTable("scale")}}>Model Scale</th>
                            <th className="table-head" onClick={()=>{this.sortTable("vendor")}}>Made By</th>
                            <th className="table-head" onClick={()=>{this.sortTable("desc")}}>Description</th>
                            <th className="table-head" onClick={()=>{this.sortTable("stock")}}>In Stock</th>
                            <th className="table-head" onClick={()=>{this.sortTable("price")}}>Your Price</th>
                            <th className="table-head" onClick={()=>{this.sortTable("msrp")}}>MSRP</th>
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

export default ProductLine;