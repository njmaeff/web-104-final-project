import { Meta } from "@njmaeff/storybook-react/react";
import React from "react";
import { WithCenter } from "../sb/withCenter";
import { FieldDisplayTable } from "./components/text";

export const FieldTable = () => (
    <FieldDisplayTable
        heading={"Overview"}
        inputs={[
            ["Current Role", "Engineer"],
            ["Current Salary", "$75,000"],
            ["Salary Target", "$90,000"],
        ]}
    />
);

export default {
    title: "text",
    decorators: [WithCenter],
} as Meta;
