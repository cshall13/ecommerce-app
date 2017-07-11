import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Home from './Containers/Home';


// go get the createStore method from the redux module(npm install --save redux)
import{ createStore } from 'redux';

// import the Provider from react-redux so react and redux can talk!(npm install --save react-redux)
// provider is a component that allows react and redux to communicate
import { Provider } from 'react-redux';

// import the rootReducer so we can give it to the store
import rootReducer from './Reducers/rootReducer';

const theStore = createStore(rootReducer);

// ReactDOM.render takes 2 args .... 1.what 2.where


ReactDOM.render(
    // store is a prop that is passed to 'Provider'
    <Provider store={theStore}>
        <App />
    </Provider>,
    document.getElementById('root')
);
