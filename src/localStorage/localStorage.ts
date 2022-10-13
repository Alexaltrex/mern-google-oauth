import {ILocalStorageData} from "../types/types";

export const setLocalStorage = (data: ILocalStorageData) => {
    localStorage.setItem('reactOauthGoogleUserInfo', JSON.stringify(data));
};

export const getLocalStorage = (): null | ILocalStorageData => {
    const userInfo = localStorage.getItem('reactOauthGoogleUserInfo');
    if (userInfo) {
        const data = JSON.parse(userInfo);
        return ({...data})
    } else {
        return null
    }
};

export const removeLocalStorage = () => {
    localStorage.removeItem('reactOauthGoogleUserInfo');
};
