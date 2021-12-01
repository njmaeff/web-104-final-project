import {Loader} from "./loader";
import React from "react";
import {DropDown} from "./control";
import {WithCenter} from "./sb/withCenter";
import "./styles/styles.scss";
import {Meta} from "@storybook/react";

export const LoaderView = () => <Loader/>;
export const DropDownMenu = () => {
    const entries = [
        {
            id: "1",
            name: "My Company2",
        },
        {
            id: "2",
            name: "My Company3",
        },
        {
            id: "3",
            name: "My Company4",
        },
    ];
    return (
        <DropDown value={"My Company"}>
            {entries.map((entry) => (
                <div key={entry.id}>
                    <a>{entry.name}</a>
                </div>
            ))}
        </DropDown>
    );
};
export default {
    title: "widgets",
    decorators: [WithCenter],
} as Meta;
