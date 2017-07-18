import React from 'react';




function ProductTableRow(props){
    const product = props.product;
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

    // if the user is logged in then they will see the button
    // if they are not logged in then they will not be offered a button
    if(props.loggedIn){
        var button = <button className="btn btn-primary"
                        onClick={
                            ()=>{
                                // run add to cart function and send product code
                                // addToCart(redux action) is created in productline.js line 73
                                props.addToCart(product.productCode , props.token);
                                console.log("Added to cart")
                            }
                        }
                >Add to Cart</button>
    }else{
        var button = " ";
    }
    return(
        <tr>
            <td>{product.productName}</td>
            <td>{product.productScale}</td>
            <td>{product.productVendor}</td>
            <td>{product.productDescription}</td>
            <td className={inStockClass}>{inStock}</td>
            <td>{product.buyPrice}</td>
            <td>{product.MSRP}</td>
            <td>
                {button}
            </td>
        </tr>
    )
}

export default ProductTableRow