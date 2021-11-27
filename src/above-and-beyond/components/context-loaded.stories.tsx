import { Meta } from "@njmaeff/storybook-react/react";
import React from "react";
import "../styles/styles.scss";
import { WithLoginUser } from "../sb/withLoginUser";
import { WithContextLoaded } from "../sb/withContextLoaded";
import { MenuTemplate } from "./page";
import { usePageCtx } from "../hooks/usePageCtx";
import { RateIssuePage, RateSuccessPage } from "./ratePage";
import { ReviewPage } from "./reviewPage";
import { MainPage } from "./mainPage";
import { ProfilePage } from "./profilePage";
import { EditPage } from "./editPage";

export const Employer = () => {
    const ctx = usePageCtx();
    return <EditPage ctx={ctx} />;
};

export const Profile = () => {
    const ctx = usePageCtx();
    return <ProfilePage ctx={ctx} />;
};

export const RateYourselfSuccess = () => {
    const ctx = usePageCtx();
    return <RateSuccessPage ctx={ctx} />;
};

export const RateYourselfIssue = () => {
    const ctx = usePageCtx();
    return <RateIssuePage ctx={ctx} />;
};

export const Review = () => {
    const ctx = usePageCtx();
    return <ReviewPage ctx={ctx} />;
};

export const MenuLayout = () => {
    const ctx = usePageCtx();
    return (
        <MenuTemplate
            currentEmployer={ctx.currentEmployerID.name}
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
    const ctx = usePageCtx();
    return <MainPage ctx={ctx} />;
};

export default {
    title: "with-context-loaded",
    decorators: [WithContextLoaded, WithLoginUser],
} as Meta;
