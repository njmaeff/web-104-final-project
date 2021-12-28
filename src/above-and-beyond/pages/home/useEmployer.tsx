import React, {useContext} from "react";
import {auth} from "../lib/firebase/connect-api";
import {useLocalStorage} from "./useLocalStorage";
import {getEmployer} from "../lib/orm/docs";
import {useAsync} from "../lib/hooks/useAsync";
import {useRouter} from "../routes";


export interface EmployerLocalState {
    currentEmployerID?: string
}

export const DEFAULT_LOCAL: EmployerLocalState = {
    currentEmployerID: "",
};

export class EmployerApi {
    static use() {
        const router = useRouter();
        const [{currentEmployerID}, updateProviderState] = useLocalStorage(EMPLOYER_KEY, DEFAULT_LOCAL);

        return new EmployerApi(router, currentEmployerID, updateProviderState)
    }

    updateEmployer = (id: string) => {
        this.updateProviderState({currentEmployerID: id})
    }

    useCurrent = () => useAsync(async () => {
        let currentEmployer = await getEmployer().read(this.currentEmployerID);
        const allEmployers = await getEmployer().readFromCollection()
        if (!currentEmployer) {
            if (allEmployers.length > 0) {
                const currentEmployer = allEmployers[0];
                this.updateEmployer(currentEmployer.id);
            } else {
                await this.router["home/new"].push({
                    query: {
                        menu: "employer"
                    }
                })
            }
        }

        return {
            currentEmployer,
            allEmployers,
        }
    }, [this.currentEmployerID], {initialState: {}});

    constructor(private router, public currentEmployerID, private updateProviderState) {

    }
}

const EmployerContext = React.createContext<EmployerApi>(null)

export const useEmployer = () => useContext(EmployerContext)


const EMPLOYER_KEY = [auth.currentUser.uid, 'employer'].join('/')


export const EmployerProvider: React.FC = ({children}) => {

    return <EmployerContext.Provider
        value={EmployerApi.use()}>{children}
    </EmployerContext.Provider>
};
