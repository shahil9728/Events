import { SET_EVENTS } from "./eventConstanst"

const initialState = {
    events: [],
    eventsFetched: false
}

export const eventReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_EVENTS: {
            return { ...state, events: action.payload, eventFetched: true }
        }
        default:
            return state
    }

}