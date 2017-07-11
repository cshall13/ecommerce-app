// this is our master reducer.... the root reducer
// the reducers hold pieces of state. the root reducer holds all the reducers.
//     I.E. the rootReducer holds ALL pieces of state, or application state.


// We need to get the combineReducers method from redux, to make a rootReducer
// that the Provider can use

import { combineReducers } from 'redux';

// import each reducer here.
    // First: import the studentReducer
import StudentReducer from './StudentReducer';


// create a rootReducer using the combineReducer method, so we can export it
// to the store in index.js
const rootReducer = combineReducers({
    // inside here we pass each reducer as a key/value
    // each key will be available as a piece of state later
    students: StudentReducer
});

export default rootReducer;