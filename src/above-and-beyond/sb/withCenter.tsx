import "./sb-styles.scss";
import React from "react";

export const WithCenter = (Story) => {
    return (
        <div className={"sb-full-page"}>
            <div className={"sb-centered"}>
                <Story />
            </div>
        </div>
    );
};
