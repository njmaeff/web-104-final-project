import React from "react";
import {WithAppLayout} from "./layout/appLayout";

const SignIn = WithAppLayout(
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
