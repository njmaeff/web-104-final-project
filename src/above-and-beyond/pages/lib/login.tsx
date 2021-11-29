import React from "react";
import dynamic from "next/dynamic";
import {Loader} from "./loader";

const SignIn = dynamic(
    () => import('./SignIn'),
    {loading: () => <Loader/>, ssr: false}
)

export const Login = () => {

    return <div className={"page page-login"}>
        <header>
            <h1>Login</h1>
        </header>
        <main>
            <SignIn/>
        </main>
    </div>
};


export default Login
