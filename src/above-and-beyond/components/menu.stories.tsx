import { Meta } from "@njmaeff/storybook-react/react";
import React from "react";
import "../styles/styles.scss";
import { WithLoginUser } from "../sb/withLoginUser";
import { Main } from "./main";

export const AppPage = () => <Main />;

export default {
    title: "menus",
    decorators: [WithLoginUser],
} as Meta;
