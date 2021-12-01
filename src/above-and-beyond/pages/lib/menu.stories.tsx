import React from "react";
import "./styles/styles.scss";
import { WithLoginUser } from "./sb/withLoginUser";
import { Main } from "./main";
import {Meta} from "@storybook/react";

export const AppPage = () => <Main />;

export default {
    title: "menus",
    decorators: [WithLoginUser],
} as Meta;
