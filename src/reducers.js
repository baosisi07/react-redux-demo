import { count } from "./index-redux";
import { auth } from "./auth-redux.js";
import { combineReducers } from "redux";
export default combineReducers({
    count,
    auth
});