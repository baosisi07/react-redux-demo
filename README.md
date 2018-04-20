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

**不断更新中，敬请期待...**

