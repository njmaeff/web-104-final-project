import React, {useContext, useEffect, useState} from "react";
import {Loader} from "../components/loader";
import {DataMeta, EmployerCollection, useEmployer, user} from "../orm/docs";
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
    const [loading, setLoading] = useState(true);
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
        setLoading(true);
        const employerDoc = await useEmployer().read(id);
        const allRolesForCurrentEmployer = await EmployerCollection.fromID(
            id
        ).roles.readFromCollection();
        const currentRoleID = allRolesForCurrentEmployer[0]?.id ?? "";

        await user.write({
            currentEmployerID: employerDoc.id,
            currentRoleID: currentRoleID,
        });

        const allEmployers = await useEmployer().readFromCollection();

        updateData({
            currentEmployerID: id,
            allEmployers,
            currentEmployer: employerDoc,
            currentRoleID,
        });

        setLoading(false);
    };

    const newEmployer = () => {
        setLoading(true);
        updateData({
            currentEmployerID: "",
            currentRoleID: "",
            allEmployers: [],
            currentEmployer: {
                name: "",
                location: "",
            },
        });
        setLoading(false);
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
        loading,
    ] as const;
};
export const PageCtxProvider = ({children}) => {
    const [meta, api, loading] = useMetaApi();

    return !loading ? (
        <PageCtx.Provider value={{...meta, api, user: auth.currentUser}}>
            {children}
        </PageCtx.Provider>
    ) : (
        <Loader/>
    );
};
export const usePageCtx = () => {
    return useContext(PageCtx);
};
