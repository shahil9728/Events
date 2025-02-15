import { SET_EMPLOYEE_ID, SET_MANAGER_ID } from "./constants";

const intialState = {
    employee_id: '',
    manager_id: ''
}

export const accountInfo = (state = intialState, action: any) => {
    switch (action.type) {
        case SET_EMPLOYEE_ID:
            return {
                ...state,
                employee_id: action.payload
            }
        case SET_MANAGER_ID:
            return {
                ...state,
                manager_id: action.payload
            }
        default:
            return state;
    }
}