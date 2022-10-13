import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {getLocalStorage, setLocalStorage} from "../localStorage/localStorage";
import {authApi} from "./auth.api";

export const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:4444/oauth2/'
        : 'https://alexaltrex-common-api.herokuapp.com/oauth2/',
    withCredentials: true,
});

// экземпляр axios для запросов на защищенные end-point
export const instanceWithAccessToken = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:4444/oauth2/'
        : 'https://alexaltrex-common-api.herokuapp.com/oauth2/',
    withCredentials: true,
});

// перехватчик запроса добавляет в заголовок токен доступа accessToken
instanceWithAccessToken.interceptors.request.use((config: AxiosRequestConfig) => {
    const userInfo = getLocalStorage();
    if (userInfo && config.headers) {
        config.headers['x-access-token'] = userInfo.accessToken;
    }
    return config;
});

// перехватчик ответа с ошибкой истечения срока токена доступа
instanceWithAccessToken.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError<{message: string}>) => {
        // console.log(error)
        // console.log(error.name)
        // console.log(error.code)
        // console.log(error.config)
        const originalRequestConfig = error.config; // конфигурация оригинального запроса хранится в response.config

        if (error?.response?.data.message === 'Token Expired Error') {
            // посылаем запрос на новый accessToken
            const getAccessTokenResponse = await authApi.refresh();
            // получаем accessToken
            const accessToken = getAccessTokenResponse.data.accessToken;
            // записываем его в localStorage
            setLocalStorage({accessToken});
            // возвращаем первоначальный запрос (с новым accessToken)
            return instanceWithAccessToken(originalRequestConfig as AxiosRequestConfig<any>);
        }
        return Promise.reject(error);
    }
);

export interface IResponse<D = {}> {
    status: 'ok' | 'error'
    data: D
    message: string
    error?: {
        field: string
        value: string
    }
}
