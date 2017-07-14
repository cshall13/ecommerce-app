

// We need to get the combineReducers method from redux, to make a rootReducer
// that the Provider can use

import { combineReducers } from 'redux';

// import each reducer here.
    // First: import the RegisterReducer
import RegisterReducer from './RegisterReducer';


// create a rootReducer using the combineReducer method, so we can export it
// to the store in index.js
const rootReducer = combineReducers({
    // inside here we pass each reducer as a key/value
    // each key will be available as a piece of state later
    registerReducer: RegisterReducer
});

export default rootReducer;