import {auth} from "../firebase/connect-api";
import {makeUseAxios} from "axios-hooks";
import axios from "axios";

export const httpClient = (token?: string) => {
    const base = axios.create({
        baseURL: process.env.NEXT_PUBLIC_WEB_HOST ?? '/',
    })
    base.interceptors.request.use(async (config) => {
        const userToken = token ?? await auth.currentUser?.getIdToken()
        if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
        }
        return config
    });
    return base;
};

export const client = httpClient();

export const useHttpClient = makeUseAxios({
    axios: client
})

