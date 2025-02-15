import { SET_EMPLOYEE_ID, SET_MANAGER_ID } from "./constants"

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