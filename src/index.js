import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


// go get the createStore method and applyMiddleware from the redux module(npm install --save redux)
import{ createStore, applyMiddleware} from 'redux';

// import the Provider from react-redux so react and redux can talk!(npm install --save react-redux)
// provider is a component that allows react and redux to communicate
import { Provider } from 'react-redux';

// import the rootReducer so we can give it to the store
import RootReducer from './Reducers/rootReducer';
// import redux-promise for our Redux AJAX (in Register.js)
import reduxPromise from 'redux-promise'; //(npm install --save redux-promise)

// const theStore = createStore(rootReducer);
const theStore = applyMiddleware(reduxPromise)(createStore)(RootReducer);

// ReactDOM.render takes 2 args .... 1.what 2.where
ReactDOM.render(
    // store is a prop that is passed to 'Provider'
    <Provider store={theStore}>
        <App />
    </Provider>,
    document.getElementById('root')
);
