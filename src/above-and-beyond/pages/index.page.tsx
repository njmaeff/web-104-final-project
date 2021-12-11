import React, {useEffect} from "react"
import type {NextPage} from "next";
import {useRouter} from "next/router";
import {Loader} from "./lib/loader";
import {checkAuthUI} from "./lib/hooks/checkAuthUI";
import {routes} from "./routes";


export const HomePage: NextPage = () => {
    const router = useRouter();

    const {isLoggedIn} = checkAuthUI()

    useEffect(() => {
        const checkAuth = async () => {
            if (isLoggedIn === false) {
                await router.push(routes.login());
            } else if (isLoggedIn === true) {
                await router.push(routes.home())
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    return <Loader/>
}

export default HomePage
