import {instance, instanceWithAccessToken, IResponse} from "./api";
import {IInfoType} from "../types/types";
import {authHeader} from "./authHeader";

export const authApi = {
    //============= REGISTER BY GOOGLE ================
    registrationByGoogle: async (code: string) => {
        const response = await instance.post("auth/registration-by-google", {code})
        return response
    },
    //============= LOGIN BY GOOGLE ================
    loginByGoogle: async (code: string) => {
        const response = await instance.post<IResponse<{accessToken: string}>>("auth/login-by-google", {code})
        return response.data
    },
    //============= REFRESH ACCESS TOKEN ================
    refresh: async() => {
        const response = await instance.get<IResponse<{accessToken: string}>>('auth/refresh');
        return response.data;
    },
    logout: async () => {
        await instanceWithAccessToken.get<IResponse>("auth/logout")
    },
    //============= USER INFO ================
    userInfo: async () => {
        const response = await instanceWithAccessToken.get<IResponse<IInfoType>>(
            "auth/userInfo",
            //{headers: authHeader()},
        )
        return response.data
    }
}
