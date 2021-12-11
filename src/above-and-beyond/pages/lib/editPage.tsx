import React from "react";
import { usePageCtx } from "./hooks/usePageCtx";
import {MenuTemplate} from "./menuTemplate";

export const EditPage: React.FC = () => {
    const { allEmployers, currentEmployer } = usePageCtx();
    return (
        <MenuTemplate
            currentEmployer={currentEmployer}
            heading={"Edit"}
            allEmployers={allEmployers}
        >
            Not Implemented
        </MenuTemplate>
    );
};
