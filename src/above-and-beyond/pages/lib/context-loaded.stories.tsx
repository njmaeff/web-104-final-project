import React from "react";
import {WithLoginUser} from "./sb/withLoginUser";
import {WithContextLoaded} from "./sb/withContextLoaded";
import {MenuTemplate} from "./page";
import {usePageCtx} from "./hooks/usePageCtx";
import {RateIssuePage, RateSuccessPage} from "./ratePage";
import {ReviewPage} from "./reviewPage";
import {ProfilePage} from "./profilePage";
import {EditPage} from "./editPage";
import {Meta} from "@storybook/react";
import {MainPage} from "../home/mainPage";

export const Employer = () => {
    return <EditPage/>;
};

export const Profile = () => {
    return <ProfilePage/>;
};

export const RateYourselfSuccess = () => {
    return <RateSuccessPage/>;
};

export const RateYourselfIssue = () => {
    return <RateIssuePage/>;
};

export const Review = () => {
    return <ReviewPage/>;
};

export const MenuLayout = () => {
    const ctx = usePageCtx();
    return (
        <MenuTemplate
            currentEmployer={ctx.currentEmployer}
            allEmployers={[
                {
                    name: "My Employer",
                    location: "My Location",
                },
            ]}
        />
    );
};

export const MainMenu = () => {
    return <MainPage/>;
};

export default {
    title: "with-context-loaded",
    decorators: [WithContextLoaded, WithLoginUser],
} as Meta;
