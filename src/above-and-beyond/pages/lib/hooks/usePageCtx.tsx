import React, {useContext, useEffect, useState} from "react";
import {DataMeta, EmployerCollection, getEmployer, user} from "../orm/docs";
import {auth} from "../firebase/connect-api";
import firebase from "firebase/compat";
import {Employer} from "../orm/validate";

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

const PageCtx = React.createContext<Partial<PagePropsContext>>({});

export const useMetaApi = () => {
    const [data, updateData] = useState<Partial<PagePropsContext>>();
    useEffect(() => {
        // initialize context data. Get the current employer id and role id
        const action = async () => {
            const metaData = await user.read();
            if (metaData.currentEmployerID) {
                await updateEmployer(metaData.currentEmployerID);
            } else {
                newEmployer();
            }
        };
        action().catch((e) => console.error(e));
    }, []);

    const updateEmployer = async (id: string) => {
        const employerDoc = await getEmployer().read(id);
        const allRolesForCurrentEmployer = await EmployerCollection.fromID(
            id
        ).roles.readFromCollection();
        const currentRoleID = allRolesForCurrentEmployer[0]?.id ?? "";

        await user.write({
            currentEmployerID: employerDoc.id,
            currentRoleID: currentRoleID,
        });

        const allEmployers = await getEmployer().readFromCollection();

        updateData({
            currentEmployerID: id,
            allEmployers,
            currentEmployer: employerDoc,
            currentRoleID,
        });

    };

    const newEmployer = () => {
        updateData({
            currentEmployerID: "",
            currentRoleID: "",
            allEmployers: [],
            currentEmployer: {
                name: "",
                location: "",
            },
        });
    };

    const updateRole = (id: string) => {
        updateData((prev) => ({
            ...prev,
            currentRoleID: id,
        }));
    };

    const newRole = () => {
        updateData((prev) => ({
            ...prev,
            currentRoleID: "",
        }));
    };

    return [
        data,
        {
            updateEmployer,
            updateRole,
            newEmployer,
            newRole,
        } as PagePropsContext["api"],
    ] as const;
};
export const PageCtxProvider = ({children}) => {
    const [meta, api] = useMetaApi();

    return <PageCtx.Provider value={{...meta, api, user: auth.currentUser}}>
        {children}
    </PageCtx.Provider>
};
export const usePageCtx = () => {
    return useContext(PageCtx);
};
