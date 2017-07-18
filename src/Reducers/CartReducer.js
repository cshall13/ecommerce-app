

// this makes 'this.props.cartInfo' in NavBar render first time as an empty array
// second time, is called as cartInfo(initialized in mapStateToProps function in NavBar )

export default function(state =[], action){
    if(action.type === "UPDATE_CART"){
        console.log(action.payload)
        return action.payload;
    }else{
        return state;
    }
}