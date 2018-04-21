import React, { Component } from 'react';
import { login, userData } from "./auth-redux.js";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
@connect(state => state.auth, {
        login,
        userData
    })
class Auth extends Component {
    //一般axios使用方法
    // constructor(props){
    // 	super(props);
    // 	this.state={
    // 		data:{}
    // 	}
    // }
    // componentDidMount() {
    // axios.get("/data")
    //     .then(res => {
    //         if(res.status==200){
    //         	this.setState({data:res.data});
    //         }
    //     })
    // }

    componentDidMount() {
        this.props.userData();
    }
    render() {
        const loginPage = (<div>
            	<h1>登录页面</h1> 
            	<p>姓名：{this.props.user}, 年龄：{this.props.age}</p>
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