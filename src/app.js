import React, { Component } from 'react';

class App extends Component {
    render() {
        const store = this.props.store;
        const num = store.getState();
        const add_F = this.props.add_F;
        const minus = this.props.minus;
        const ayncMinus = this.props.ayncMinus;
        return (
            <div>
                <h1>现在有小花{num}朵</h1>
                <button onClick={() => store.dispatch(add_F())}>申请小花</button>
                <button onClick={() => store.dispatch(minus())}>上交小花</button>
                <button onClick={() => store.dispatch(ayncMinus())}>等会上交小花</button>
            </div>
        )
    }
}

export default App;