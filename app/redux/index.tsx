import { combineReducers } from "redux";
import { accountInfo } from "./Employee/accountInfo/accountInfoReducer";
import { eventReducer } from "./Manager/Events/eventReducer";
import { onboardingReducer } from "./Employee/onboarding/onboardingReducer";


const rootReducer = combineReducers({
    accountInfo: accountInfo,
    eventReducer: eventReducer,
    onboardingReducer: onboardingReducer
})

export default rootReducer;