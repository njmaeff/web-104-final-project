import React, {useEffect} from "react"
import type {NextPage} from "next";
import {useRouter} from "next/router";
import {useAuthUI} from "../hooks/useFirebaseUI";

export const LoginPage: NextPage = () => {
    const router = useRouter();

    const {isLoggedIn, newUser} = useAuthUI()

    useEffect(() => {
        if (isLoggedIn && newUser) {
            router.push('/getting-started')
        } else if (isLoggedIn) {
            router.push('/app')
        }

    }, [isLoggedIn, newUser]);

    return <div className={"page page-login"}>
        <header>
            <h1>Login</h1>
        </header>
        <main>
            <div id={"firebaseui-auth-container"}/>
        </main>
    </div>
}

export default LoginPage
