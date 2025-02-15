import { SET_EVENTS } from "./eventConstanst"

const initialState = {
    events: []
}

export const eventReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_EVENTS: {
            return { ...state, events: action.payload }
        }
        default:
            return state
    }

}