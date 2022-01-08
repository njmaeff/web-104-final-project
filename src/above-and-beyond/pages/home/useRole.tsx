import React, {useContext} from "react";
import {useEmployer} from "./useEmployer";
import {auth} from "../lib/firebase/connect-api";
import {useLocalStorage} from "./useLocalStorage";
import {EmployerCollection} from "../lib/orm/docs";
import {useAsync} from "../lib/hooks/useAsync";
import {useRouter} from "../routes";

export interface RoleLocal {
    currentRoleID: string
}

export const DEFAULT_LOCAL: RoleLocal = {
    currentRoleID: null
}

export class RoleApi {
    static use() {
        const [{currentRoleID}, updateRoleState] = useLocalStorage(getRoleKey(), DEFAULT_LOCAL);
        const {currentEmployerID} = useEmployer()
        const router = useRouter()
        return new RoleApi(router, currentRoleID, currentEmployerID, updateRoleState)
    }

    updateRole = (id: string) => {
        this.updateRoleState({currentRoleID: id});
    };

    // select a default role when none is set
    useCurrent = () => useAsync(async () => {
        if (this.currentEmployerID) {

            let currentRole;
            if (this.currentRoleID) {
                currentRole = await EmployerCollection.fromID(this.currentEmployerID).roles.read(this.currentRoleID);
            }
            const allRoles = await EmployerCollection.fromID(this.currentEmployerID).roles.readFromCollection()

            if (!currentRole) {
                if (allRoles.length > 0) {
                    const role = allRoles[0];
                    this.updateRole(role.id);
                    currentRole = role;
                } else {
                    await this.router["home/new"].push({
                        query: {
                            menu: "role"
                        }
                    })
                }
            }
            return {
                currentRole,
                allRoles
            }
        }
    }, [this.currentEmployerID, this.currentRoleID], {initialState: {}})


    constructor(private router, public currentRoleID: string, private currentEmployerID: string, private updateRoleState) {
    }
}

const RoleContext = React.createContext<RoleApi>(null);
export const useRole = () => useContext(RoleContext)

export const getRoleKey = () => [auth.currentUser.uid, 'ROLE'].join('/')

export const RoleProvider: React.FC = ({children}) => {

    return <RoleContext.Provider value={RoleApi.use()}>
        {children}
    </RoleContext.Provider>
};

