import React from "react";
import {WithLoginUser} from "./sb/withLoginUser";
import {WithContextLoaded} from "./sb/withContextLoaded";
import {usePageCtx} from "./hooks/usePageCtx";
import {ReviewPage} from "../review/reviewPage";
import {ProfilePage} from "./profilePage";
import {EditPage} from "./editPage";
import {Meta} from "@storybook/react";
import {MainPage} from "../employer/mainPage";
import {MenuTemplate} from "./menuTemplate";
import {RateIssuePage} from "../rate/rateIssuePage";
import {RateSuccessPage} from "../rate/rateSuccessPage";

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
