import { Meta } from "@njmaeff/storybook-react/react";
import React from "react";
import { PrimaryButton } from "./button";
import { WithCenter } from "../sb/withCenter";

export const Primary = () => {
    return <PrimaryButton>Primary</PrimaryButton>;
};

export default {
    title: "buttons",
    decorators: [WithCenter],
} as Meta;
