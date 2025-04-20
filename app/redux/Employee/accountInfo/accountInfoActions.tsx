import { SET_EMPLOYEE_ID, SET_MANAGER_ID, UPDATE_EMPLOYEE_INFO, UPDATE_MANAGER_INFO, RESET_ACCOUNT_INFO } from "./constants"

export const setEmployeeId = (employeeId: string) => {
    return {
        type: SET_EMPLOYEE_ID,
        payload: employeeId
    }
}

export const setManagerId = (managerId: string) => {
    return {
        type: SET_MANAGER_ID,
        payload: managerId
    }
}

export const updateEmployeeInfo = (employeeInfo: any) => {
    return {
        type: UPDATE_EMPLOYEE_INFO,
        payload: employeeInfo
    }
}

export const updateManagerInfo = (managerInfo: any) => {
    return {
        type: UPDATE_MANAGER_INFO,
        payload: managerInfo
    }
}

export const resetAccountInfo = () => {
    return {
        type: RESET_ACCOUNT_INFO,
    }
}