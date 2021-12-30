import {auth} from "../firebase/connect-api";
import {makeUseAxios} from "axios-hooks";
import axios from "axios";

export const httpClient = () => {
    const base = axios.create({
        baseURL: process.env.STORYBOOK ? process.env.NEXT_PUBLIC_WEB_HOST : '/',
    })
    base.interceptors.request.use(async (config) => {
        const user = await auth.currentUser?.getIdToken()
        if (user) {
            config.headers.Authorization = `Bearer ${user}`;
        }
        return config
    });
    return base;
};

export const client = httpClient();

export const useHttpClient = makeUseAxios({
    axios: client
})

