import React from "react";
import { DataMeta, Employer } from "../../orm/docs";
import firebase from "firebase/compat";

export interface PagePropsContext extends DataMeta {
    user: firebase.User;
    api: {
        updateEmployer(id: string);
        updateRole(id: string);
        newRole(): void;
        newEmployer(): void;
    };
    allEmployers: Employer[];
    currentEmployer: Employer;
}

export type PageProps = {
    ctx: Partial<PagePropsContext>;
};
export type Page<ComponentProps = {}> = React.FC<ComponentProps>;
