import React from "react";
import {WithoutSSRAppLayout} from "./layout/appLayout";

const SignIn = WithoutSSRAppLayout(
    () => import('./SignIn'),
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
