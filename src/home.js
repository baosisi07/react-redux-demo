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
        //定义登录页内容
        const appPage = (
        <div>
        <ul>
        	<li><Link to={`${match}/test2`}>测试页面1</Link></li>
        	<li><Link to={`${match}/test1`}>测试页面2</Link></li>
        	<li><Link to={`${match}`}>本页面</Link></li>
        </ul>{ /*exact表明完全比配*/ }
     	<Route path={`${match}`} exact component={App}></Route>
     	<Route path={`${match}/test1`} component={test1}></Route>
     	<Route path={`${match}/test2`} component={test2}></Route>
     	<button onClick={this.props.logout}>退出登录</button>
         </div>
        );
        //定义未登录时的跳转
        const redirector = <Redirect to="/login"></Redirect>;
        //根据登录状态进入展示不同的内容
        return this.props.isAuth ? appPage : redirector
    }
}
export default Home;