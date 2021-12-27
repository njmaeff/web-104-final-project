import React, {useContext} from "react";
import {useEmployer} from "./useEmployer";
import {auth} from "../lib/firebase/connect-api";
import {useLocalStorage} from "./useLocalStorage";
import {EmployerCollection} from "../lib/orm/docs";
import {useAsync, UseAsyncReturn} from "../lib/hooks/useAsync";
import {Role} from "../lib/orm/validate";

export interface RoleLocal {
    currentRoleID: string
}

export const DEFAULT_LOCAL: RoleLocal = {
    currentRoleID: ""
}

export type RoleContext = {
    updateRole: (id: string) => void
    newRole: () => void
    currentRole: UseAsyncReturn<Role>
    allRoles: UseAsyncReturn<Role[]>
    isLoading: boolean
} & RoleLocal

const RoleContext = React.createContext<RoleContext>(null);
export const useRole = () => useContext(RoleContext)

export const ROLE_KEY = [auth.currentUser.uid, 'ROLE'].join('/')

export const RoleProvider: React.FC = ({children}) => {

    const [{currentRoleID}, updateRoleState] = useLocalStorage(ROLE_KEY, DEFAULT_LOCAL);
    const {currentEmployerID} = useEmployer()

    const updateRole = (id: string) => {
        updateRoleState({currentRoleID: id});
    };

    const newRole = () => {
        updateRoleState(DEFAULT_LOCAL)
    };

    // select a default role when none is set
    const currentRole = useAsync(async () => {
        if (currentEmployerID) {
            const currentRole = await EmployerCollection.fromID(currentEmployerID).roles.read(currentRoleID);
            if (!currentRole) {
                const result = await EmployerCollection.fromID(currentEmployerID).roles.readFromCollection();
                if (result.length > 0) {
                    const role = result[0];
                    updateRole(role.id)
                    return role
                }
            } else {
                return currentRole
            }
        }
    }, [currentEmployerID, currentRoleID])

    const allRoles = useAsync(
        () => {
            return EmployerCollection.fromID(currentEmployerID).roles.readFromCollection()
        }, [currentEmployerID, currentRoleID], {
            initialState: []
        }
    )


    return <RoleContext.Provider value={{
        currentRoleID,
        isLoading: currentRole.isInProgress,
        currentRole,
        allRoles,
        newRole,
        updateRole,
    }}>
        {children}
    </RoleContext.Provider>
};
