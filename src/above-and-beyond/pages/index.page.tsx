import React, {useEffect} from "react"
import type {NextPage} from "next";
import {useRouter} from "next/router";
import {Loader} from "../components/loader";
import {checkAuthUI} from "../hooks/checkAuthUI";


export const HomePage: NextPage = () => {
    const router = useRouter();

    const {isLoggedIn} = checkAuthUI()

    useEffect(() => {
        const checkAuth = async () => {
            if (isLoggedIn === false) {
                await router.push('/login');
            } else if (isLoggedIn === true) {
                await router.push('/main/view')
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    return <Loader/>
}

export default HomePage
