import React from "react";
import { MenuTemplate } from "./page";
import { usePageCtx } from "./hooks/usePageCtx";

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
