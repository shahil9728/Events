import { SET_EMPLOYEE_ID, SET_MANAGER_ID, UPDATE_EMPLOYEE_INFO, UPDATE_MANAGER_INFO, RESET_ACCOUNT_INFO } from "./constants";

const intialState = {
    employee_id: '',
    manager_id: '',
    name: '',
    number: '',
    email: '',
    location: '',  
    dob: '',
    gender: '',
    role: '',
    resume_url: '',
    profile_url: '',
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
        case UPDATE_EMPLOYEE_INFO:
            return {
                ...state,
                ...action.payload,
            }
        case UPDATE_MANAGER_INFO:
            return {
                ...state,
                ...action.payload,
            }
        case RESET_ACCOUNT_INFO:
            return intialState;
        default:
            return state;
    }
}