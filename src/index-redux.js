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
export function ayncMinus() {
    return dispatch => {
        setTimeout(() => {
            dispatch(minus())
        }, 2000);
    }
}