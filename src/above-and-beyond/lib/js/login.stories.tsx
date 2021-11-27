import { Meta } from "@njmaeff/storybook-react/react";
import React, { useEffect } from "react";
import { LoginPage } from "../components/login";
import "../styles.scss";
import "../firebaseui.scss";
import { useAuthUI } from "../hooks/useFirebaseUI";
import { GetStartedPage } from "../components/getStarted";

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
