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
                <button className="btn btn-primary"
                        onClick={
                            ()=>{
                                // run add to cart function and send product code
                                // addToCart(redux action) is created in productline.js line 73
                                props.addToCart(product.productCode);
                                console.log("Added to cart")
                            }
                        }
                >Add to Cart</button>
            </td>
        </tr>
    )
}

export default ProductTableRow