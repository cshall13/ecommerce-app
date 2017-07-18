import $ from 'jquery';


export default function(productCode,token){
    var thePromise = $.ajax({
        method: "POST",
        url: window.hostAddress + '/updateCart',
        data: {
            productCode: productCode,
            token: token
        }
    });
    return{
        type: "UPDATE_CART",
        payload: thePromise
    }
}