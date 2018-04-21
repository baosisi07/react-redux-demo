import axios from "axios";
const Login = "Login";
const Logout = "Logout";
const UserData = "UserData";
const initState = {
    isAuth: false,
    user: "baosisi",
    age: 25
}
export function auth(state = initState, action) {
    switch (action.type) {
    case Login:
        return {
            ...state,
            isAuth: true
        }
    case Logout:
        return {
            ...state,
            isAuth: false
        }
    case UserData:
        return {
            ...state,
            ...action.data
        }
    default:
        return state
    }
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

export function userInfo(dat) {
    return {
        type: UserData,
        data: dat
    }
}
export function login() {
    return {
        type: Login
    }
}
export function logout() {
    return {
        type: Logout
    }
}