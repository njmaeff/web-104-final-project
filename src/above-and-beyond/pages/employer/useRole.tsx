import React, {useContext, useEffect} from "react";
import {useEmployer} from "./useEmployer";
import {auth} from "../lib/firebase/connect-api";
import {useLocalStorage} from "./useLocalStorage";
import {EmployerCollection} from "../lib/orm/docs";

export interface RoleLocal {
    currentRoleID: string
}

export const DEFAULT_LOCAL: RoleLocal = {
    currentRoleID: ""
}

export type RoleContext = {
    updateRole: (id: string) => void
    newRole: () => void
} & RoleLocal

const RoleContext = React.createContext<RoleContext>(null);
export const useRole = () => useContext(RoleContext)

export const ROLE_KEY = [auth.currentUser.uid, 'ROLE'].join('/')

export const RoleProvider: React.FC = ({children}) => {

    const [roleState, updateRoleState] = useLocalStorage(ROLE_KEY, DEFAULT_LOCAL);
    const {currentEmployerID} = useEmployer()

    const updateRole = (id: string) => {
        updateRoleState({currentRoleID: id});
    };

    const newRole = () => {
        updateRoleState(DEFAULT_LOCAL)
    };

    // select a default role when none is set
    useEffect(() => {
        if (currentEmployerID) {
            (async () => {
                const result = await EmployerCollection.fromID(currentEmployerID).roles.readFromCollection();
                if (result.length > 0) {
                    updateRole(result[0].id)
                }
            })()
        }
    }, [currentEmployerID])


    return <RoleContext.Provider value={{
        ...roleState,
        newRole,
        updateRole,
    }}>
        {children}
    </RoleContext.Provider>
};
