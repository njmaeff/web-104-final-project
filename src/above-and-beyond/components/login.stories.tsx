import { Meta } from "@njmaeff/storybook-react/react";
import React, { useEffect } from "react";
import { LoginPage } from ".//login";
import "../styles/styles.scss";
import "../styles/firebaseui.scss";
import { useAuthUI } from "./SignIn";
import { GetStartedPage } from ".//getStarted";

export const LoginPageView = () => {
    useEffect(() => {
        useAuthUI();
    });
    return <LoginPage />;
};

export const GetStarted = () => {
    return <GetStartedPage />;
};

export default {
    title: "login",
} as Meta;
