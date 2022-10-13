import {getLocalStorage} from "../localStorage/localStorage";
import {AxiosRequestHeaders} from "axios";

export const authHeader = () => {
    const userInfo = getLocalStorage();

    if (userInfo) {
        return {
            'x-access-token': userInfo.accessToken
        } //as AxiosRequestHeaders;
    } else {
        return {} as AxiosRequestHeaders
    }
};
