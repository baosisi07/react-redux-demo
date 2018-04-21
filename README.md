本示例基于 [Create React App](https://github.com/facebookincubator/create-react-app).

 关于Create React App的更多配置信息可参照[这里](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
## 搭建项目
安装 create-react-app 并生成目录
```
npm create-react-app react-redux-demo
cd react-redux-demo
npm start
```

#### 目录结构

```
react-redux-demo/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

### 
运行 `npm start`命令后，浏览器会自动打开
[http://localhost:3000](http://localhost:3000) 

当页面文件有修改时会自动更新。

## redux简单使用示例

[redux官网](https://redux.js.org/)

**redux主要由三部分组成：store，reducer，action。**

##### store是一个对象，它有四个主要的方法

1. dispatch:
用于action的分发
2. subscribe：
监听state的变化
3. getState：
获取store中的state——当我们用action触发reducer改变了state时，需要再拿到新的state里的数据。
4. replaceReducer:
替换reducer，改变state修改的逻辑。

##### action:
action是一个对象，其中type属性是必须的，同时可以传入一些数据。action可以用actionCreactor进行创造。dispatch就是把action对象发送出去。

##### reducer:
reducer是一个函数，它接受一个state和一个action，根据action的type返回一个新的state。根据业务逻辑可以分为很多个reducer，然后通过combineReducers将它们合并，state树中有很多对象，每个state对象对应一个reducer，state对象的名字可以在合并时定义。

安装redux `npm install redux --save`

删除src文件夹下的其他文件

index.js
```
import { createStore } from "redux";

// 定义reducer（纯函数）接收两个参数：一个是旧的state,一个是action(包含type属性，reducer根据这个type做不同的处理)
function count(state = 10, action) {
    switch (action.type) {
    case "add":
        return state + 1;
    case "minus":
        return state - 1;
    default:
        return state;
    }
}
// 新建store 通过createStore传入reducer建立
const store = createStore(count);

//定义listener事件并通过store.subscribe方法进行订阅
function listener(){
  const current=store.getState();
  console.log(`目前数量为${current}`);
}
store.subscribe(listener);
store.dispatch({
    type: "minus"
});

```

## redux与react如何使用
- 把store.dispatch方法传递给组件，内部可以调用并修改状态
- subscribe订阅render函数，使每次修改都重新渲染
- redux相关内容放在单独的文件中（index-redux.js）

index-redux.js
```
const ADD_F = "ADD_F";
const MINUS = "MINUS";

export function count(state = 10, action) {
    switch (action.type) {
    case ADD_F:
        return state + 1;
    case MINUS:
        return state - 1;
    default:
        return state;
    }
}
//定义生成action的函数
export function add_F() {
    return {
        type: ADD_F
    }
}
export function minus() {
    return {
        type: MINUS
    }
}
```

index.js
```
import App from "./app";
import { createStore} from "redux";
import { count, add_F, minus, ayncMinus } from "./index-redux";

const store = createStore(count);
function render() {
  //以属性的方式传入store、reducer及action
    ReactDOM.render(<App store={store} add_F={add_F} minus={minus} />, document.getElementById('root'));
}
render();
store.subscribe(render);//通过订阅实现页面更新
```

app.js
```
import React, { Component } from 'react';

class App extends Component {
    render() {
        const store = this.props.store;
        const num = store.getState();
        const add_F = this.props.add_F;
        const minus = this.props.minus;
        return (
            <div>
                <h1>现在有小花{num}朵</h1>
                <button onClick={() => store.dispatch(add_F())}>申请小花</button>
                <button onClick={() => store.dispatch(minus())}>上交小花</button>
            </div>
        )
    }
}

export default App;
```

目前dispatch只能实现即时更新，那么怎么实现异步更新呢？

此时需要借助**redux-thunk**

安装 `npm install redux-thunk --save`

index-redux.js
```
//新增异步更新
export function ayncMinus() {
    return dispatch => {
        setTimeout(() => {
            dispatch(minus())
        }, 2000);
    }
}
```

index.js
```
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const store = createStore(count, applyMiddleware(thunk));
//将新增的action ayncMinus同样以属性方式绑定到App组件上
```
app.js中以同样方式将ayncMinus绑定到按钮的onClick事件上即可

## react-redux的使用

[react-redux参考文档](https://www.npmjs.com/package/react-redux)

react-redux提供了Provider和connect
Provider是一个组件，它接受store作为props，然后通过context往下传，这样react中任何组件都可以通过context获取store。也就意味着我们可以在任何一个组件里利用dispatch(action)来触发reducer改变state。

connect --connect(mapStateToProps, mapDispatchToProps, mergeProps, options) 是一个函数，它接受四个参数并且再返回一个函数--wrapWithConnect，wrapWithConnect接受一个组件作为参数wrapWithConnect(component)，它内部定义一个新组件Connect(容器组件)并将传入的组件(ui组件)作为Connect的子组件然后return出去。

所以它的完整写法是这样的：connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(component)

安装 `npm install react-redux --save`

通过在组件外层套上Provider并传入store的方式向子组件传入相关state的信息

```
ReactDOM.render(
    <Provider  store={store}>
      <div</div>
  </Provider>,
    document.getElementById('root'));
```

在子组件中通过connect将redux和组件进行连接
```
const mapstatetoprops = (state) => {
    return {
        num: state
    }
}
const actionCreator = {
    add_F,
    minus,
    ayncMinus
};
App = connect(mapstatetoprops, actionCreator)(App);

...
  <button onClick={this.props.add_F}>申请小花</button>
...
```
调用时直接通过属性即可自动触发dispatch操作

connect可以通过装饰器以更简洁的方式书写
安装装饰器 npm install babel-plugin-transform-decorators-legacy --save-dev
 运行 `npm run eject` 自定义相关配置
package.json中配置 babel属性中新增 `"plugins":["transform-decorators-legacy"]`

以上代码等同于
```
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
```

以上是react-redux的简单使用

## react-router4使用

- react-router4是全新版本，和之前版本不兼容，浏览器和RN均兼容
- React开发单页面应用必备，践行路由即组件的概念
- 动态路由、Route、Link、Switch

[react-router官网地址](https://reacttraining.com/react-router/web/guides/philosophy)

安装 `npm install react-router-dom --save`

router4使用react-router-dom作为浏览器端的路由

**组件**

- BrowserRouter 包裹整个应用,结合react-redux用时需放在Provider里面

- Router 路由对应渲染的组件，可嵌套

- Link用于跳转 点击跳转到指定路由

- url参数，Route组件可用冒号标识参数

- Redirect组件 设置跳转

- Switch只渲染一个子Route组件

- 一个match对象包含有关<Route path>如何匹配URL的信息。match对象包含以下属性：
  - params - （对象）从URL对应的路径的动态段解析的键/值对
  - isExact- （布尔值）如果整个URL匹配则为true（没有结尾字符）
  - path - （字符串）用于匹配的路径模式。用于构建嵌套<Route>s 实际设置的路径
  - url - （字符串）URL的匹配部分。用于构建嵌套<Link>s 实际访问路径
###### 用户登录示例

新建授权登录的reducer(auth-redux.js)
此时页面中用到多个reducer,所以需要借助redux的combineReducers将reducer进行组合并返回

reducers.js
```
import { count } from "./index-redux";
import { auth } from "./auth-redux.js";
import { combineReducers } from "redux";
export default combineReducers({
    count,
    auth
});
```

index.js
```
import { BrowserRouter, Route, Link, Redirect, Switch } from "react-router-dom";
import reducers from "./reducers.js";
...
//新建store是将第一个参数替换为组合reducer
const store = createStore(reducers, applyMiddleware(thunk));
ReactDOM.render(
    <Provider  store={store}>
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Auth}></Route>
          <Route path='/home' component={Home}></Route>
          //当未匹配到路由时则跳转到Redirect指定的页面
          <Redirect to="/home"></Redirect>
        </Switch>
      </BrowserRouter>
  </Provider>,
    document.getElementById('root'))
```

home.js
```
...
//state此时包含两个定义reducer时的参数，分别是count和auth，本页面用到auth相关的信息，通过state.auth即可拿到
@connect(state => state.auth, {
        logout
    })

class Home extends Component {
    render() {
        const match = this.props.match.url;//获取当前页面的路径，用于以下嵌套路由
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
        //根据登录状态进入展示不同的内容 未登录则跳转登录页
        return this.props.isAuth ? appPage : redirector
    }
}
...
```

## express+mongodb搭建后台

[express使用参考](http://www.expressjs.com.cn/)

1. 在项目目录下新建服务端文件夹server并新增server.js用于开启后端服务

```
const express = require("express");
//新建app
const app = express();

对匹配到的路由的get请求进行数据响应
app.get("/", function(req, res) {
    res.send("<h1>您好！</h1>");
})
app.get("/data", function(req, res) {
  //发送JSON响应数据
    res.json({
        name: "baonianwen",
        age: 25
    });
})
//设置服务端监听端口
app.listen(9093, function() {
    console.log("node app start at port 9093");
})
```

由于每次修改服务端代码需要重启，所以可以安装nodemon，它可以监听路由和响应内容，自动重启node服务
 `npm install nodemon -g`

然后运行命令`nodemon server`启动服务

此时打开[http://localhost:9093](http://localhost:9093)即可看到返回内容

2. 安装mongobd (非关系型数据库)
[mongodb官网](https://www.mongodb.com/)
[mongodb下载地址](https://www.mongodb.com/download-center#community)

3. 安装mongoose,通过mongoose操作mongodb,存储的就是json,相对mysql来说，要易用很多

**mongoose基本使用**

- connect连接数据库

- 定义文档类型，Schema和model新建模型

- 一个数据库文档对应一个模型，通过模型对数据库进行操作

- String、Number等定义数据结构

-create,remove,update用来增删改的操作

- Find和findOne用来查询数据 （find查找的是数组，findOne是对象）

使用示例

```
//类似mysql表 mongo里有文档、字段概念 
//新建文档模型并定义相关字段
const User = mongoose.model("user", new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    }
}))
//新增数据
User.create({
    user: "小蚊子",
    age: 27
}, function(err, doc) {
    if (!err) {
        console.log(doc);
    } else {
        console.log(err);
    }
})
//更新数据
User.update({
    "user": "小蚊子"
}, {
    "$set": {
        age: 18
    }
}, function(err, doc) {
    console.log(doc);
})
```

## 前后端联调

使用axios发送异步请求

1. 前后端端口不一致时，使用proxy配置
安装axios `npm install axios --save`
[axios文档](https://www.npmjs.com/package/axios)

2. axios拦截器统一loading处理

本示例使用antd-mobile,先安装
`npm install antd-mobile --save-dev`

config.js
```
import axios from "axios";
import { Toast } from "antd-mobile";
//拦截请求
axios.interceptors.request.use(function(config) {
    Toast.loading("加载中", 0);
    return config;
})
//拦截响应
axios.interceptors.response.use(function(config) {
  //设置定时器方便看到loading效果
    setTimeout(() => {
        Toast.hide()
    }, 2000)
    return config;
})
```

页面中引入config,并引入antd样式
```
import "./config";
import 'antd-mobile/dist/antd-mobile.css';
```

3. redux里使用异步数据，渲染页面

- auth-redux.js中需新增action及响应的处理函数

```
import axios from "axios";
const UserData = "UserData";
const initState = {
    isAuth: false,
    user: "baosisi",
    age: 25
}
export function auth(state = initState, action) {
    switch (action.type) {
  ...
  //新增用户数据处理函数，返回新state
    case UserData:
        return {
            ...state,
            ...action.data
        }
  ...
}
//异步请求数据
export function userData() {
    return dispatch => {
        axios.get("/data")
            .then(res => {
                if (res.status == 200) {
                    dispatch(userInfo(res.data));
                }
            })
    }
}
//创建生成action的函数
export function userInfo(dat) {
    return {
        type: UserData,
        data: dat
    }
}
```

- 使用页面中引入异步请求函数userData并加入connect函数中

- 在页面加载完后执行异步请求操作
```
componentDidMount() {
        this.props.userData();
    }
```

- 然后就可以在页面中直接使用

`<p>姓名：{this.props.user}, 年龄：{this.props.age}</p>`



