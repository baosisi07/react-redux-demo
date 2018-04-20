import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { add_F, minus, ayncMinus } from "./index-redux";
// const mapstatetoprops = (state) => {
//     return {
//         num: state
//     }
// }
// const actionCreator = {
//     add_F,
//     minus,
//     ayncMinus
// };
// App = connect(mapstatetoprops, actionCreator)(App);

//安装装饰器 npm install babel-plugin-transform-decorators-legacy --save-dev
// npm run eject
//package.json中配置 babel属性中新增 "plugins":["transform-decorators-legacy"]
// 以上代码等同于
@connect(
    //将state什么属性放到props里
    state => ({num:state.count
    }),
    //将什么方法放到props里，会自动dispatch
    {
        add_F,
        minus,
        ayncMinus
    })

class App extends Component {
        render() {
            const num = this.props.num;
            return (
                <div>
            	<h1>现在有小花{num}朵</h1>
            	<button onClick={this.props.add_F}>申请小花</button>
            	<button onClick={this.props.minus}>上交小花</button>
            	<button onClick={this.props.ayncMinus}>等会上交小花</button>
			</div>
            )
        }
    }



    export default App;