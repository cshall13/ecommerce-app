import $ from 'jquery';

export default function(userData){
    var thePromise = $.ajax({
        // ###############################################################
 // ############################// POST = req.body(info passed through the body/window) GET = req.query(info passed through the url)###############
// ######################################################################
        method: "POST",
        url: window.hostAddress + '/register',
        data: userData
    })
    return{
        type: "REGISTER",
        payload: thePromise
    }
}


