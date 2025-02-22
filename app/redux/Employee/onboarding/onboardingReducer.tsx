import { onboardingIntialState, SET_EMAIL, SET_ID, SET_LANGUAGES, SET_NAME, SET_NUMBER, SET_NUMBER_VERIFIED, SET_ONBOARDING_DATA, SET_PASSWORD, SET_PHOTOS, SET_ROLE } from "./onboardingconstants";

export const onboardingReducer = (state = onboardingIntialState, action: any) => {
    switch (action.type) {
        case SET_ID:
            return { ...state, id: action.payload };
        case SET_EMAIL:
            return { ...state, email: action.payload };
        case SET_PASSWORD:
            return { ...state, password: action.payload };
        case SET_NAME:
            return { ...state, name: action.payload };
        case SET_NUMBER:
            return { ...state, number: action.payload };
        case SET_NUMBER_VERIFIED:
            return { ...state, numberVerified: action.payload };
        case SET_ROLE:
            return { ...state, role: action.payload };
        case SET_PHOTOS:
            return { ...state, photos: action.payload };
        case SET_LANGUAGES:
            return { ...state, languages: action.payload };
        case SET_ONBOARDING_DATA:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}