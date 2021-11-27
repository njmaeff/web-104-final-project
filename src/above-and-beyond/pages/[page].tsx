import React, {useEffect} from "react"
import type {NextPage} from "next";
import {useRouter} from "next/router";
import {checkAuthUI} from "../hooks/checkAuthUI";
import {Main} from "../components/app";

export const LoginPage: NextPage = () => {
    const router = useRouter();

    const {isLoggedIn} = checkAuthUI()

    useEffect(() => {
        if (isLoggedIn === false) {
            router.push('/login')
        }

    }, [isLoggedIn]);


    return <Main/>
}

export default LoginPage
