import { SET_EVENTS } from "./eventConstanst"

export const setEvents = (events: any) => {
    return {
        type: SET_EVENTS,
        payload: events
    }
}