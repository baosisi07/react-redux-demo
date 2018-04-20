import React, { Component } from 'react';
import { login } from "./auth-redux.js";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
@connect(state => state.auth, {
        login
    })
class Auth extends Component {
    render() {
        const loginPage = (<div>
            	<h1>登录页面</h1> 
            	<p>您目前没有权限，请先登录</p>
            	<button onClick={this.props.login}>登录</button>	
			</div>);
        const redirector = <Redirect to="/home"></Redirect>;
        return (
        this.props.isAuth ? redirector : loginPage
        )
    }
}

export default Auth;