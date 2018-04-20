import React, { Component } from 'react';
import { Link, Route, Redirect } from "react-router-dom";
import App from "./app-react-redux";
import { connect } from "react-redux";
import { logout } from "./auth-redux.js";
function test1() {
    return <h1>您好吗</h1>
}
function test2() {
    return <h1>我不好</h1>
}
@connect(state => state.auth, {
        logout
    })

class Home extends Component {
    render() {
        const match = this.props.match.url;
        const appPage = (
        <div>
        <ul>
        	<li><Link to={`${match}/test2`}>测试页面1</Link></li>
        	<li><Link to={`${match}/test1`}>测试页面2</Link></li>
        	<li><Link to={`${match}`}>本页面</Link></li>
        </ul>
     	<Route path={`${match}`} exact component={App}></Route>
     	<Route path={`${match}/test1`} component={test1}></Route>
     	<Route path={`${match}/test2`} component={test2}></Route>
     	<button onClick={this.props.logout}>退出登录</button>
         </div>
        );
        const redirector = <Redirect to="/login"></Redirect>;
        return (
        this.props.isAuth ? appPage : redirector
        )
    }
}
export default Home;