import { SET_EMAIL, SET_LANGUAGES, SET_NAME, SET_NUMBER, SET_NUMBER_VERIFIED, SET_PASSWORD, SET_PHOTOS, SET_ROLE } from "./onboardingconstants";

export const setEmail = (email: string) => {
    return {
        type: SET_EMAIL,
        payload: email,
    };
}

export const setPassword = (password: string) => {
    return {
        type: SET_PASSWORD,
        payload: password,
    };
}

export const setName = (name: string) => {
    return {
        type: SET_NAME,
        payload: name,
    };
}

export const setNumber = (number: string) => {
    return {
        type: SET_NUMBER,
        payload: number,
    };
}

export const setNumberVerified = (numberVerified: boolean) => {
    return {
        type: SET_NUMBER_VERIFIED,
        payload: numberVerified,
    };
}

export const setRole = (role: string) => {
    return {
        type: SET_ROLE,
        payload: role,
    };
}

export const setPhotos = (photos: string[]) => {
    return {
        type: SET_PHOTOS,
        payload: photos,
    };
}

export const setLanguages = (languages: string[]) => {
    return {
        type: SET_LANGUAGES,
        payload: languages,
    };
}