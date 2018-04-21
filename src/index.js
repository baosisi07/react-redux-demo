import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// 简单示例redux用法
// import { createStore } from "redux";

// // reducer
// function count(state = 10, action) {
//     switch (action.type) {
//     case "add":
//         return state + 1;
//     case "minus":
//         return state - 1;
//     default:
//         return state;
//     }
// }
// // 新建store
// const store = createStore(count);
// store.dispatch({
//     type: "minus"
// });
// function listener() {
//     const current = store.getState();
//     console.log(`目前数量为${current}`);
// }
// store.subscribe(listener);
// const init = store.getState();
// console.log(init);

// redux使用
// import App from "./app";
// import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// import { count, add_F, minus, ayncMinus } from "./index-redux";

// const store = createStore(count, applyMiddleware(thunk));
// function render() {
//     ReactDOM.render(<App store={store} ayncMinus={ayncMinus} add_F={add_F} minus={minus} />, document.getElementById('root'));
// }
// render();
// store.subscribe(render);
// registerServiceWorker();

//react-redux的使用
import App from "./app-react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducers from "./reducers.js";
import { BrowserRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import Auth from "./auth.js";
import Home from "./home.js";
import "./config";
import 'antd-mobile/dist/antd-mobile.css';
const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
    <Provider  store={store}>
    	<BrowserRouter>
    		<Switch>
    			<Route path='/login' component={Auth}></Route>
    			<Route path='/home' component={Home}></Route>
    			<Redirect to="/home"></Redirect>
    		</Switch>
    	</BrowserRouter>
	</Provider>,
    document.getElementById('root'));

registerServiceWorker();