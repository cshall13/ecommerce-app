import $ from 'jquery';


export default function(cartData){
    console.log(cartData);
    var thePromise = $.ajax({
        method: "POST",
        url: window.hostAddress + '/updateCart',
        data: {productCode: cartData}
    });
    return{
        type: "UPDATE_CART",
        payload: thePromise
    }
}