import React, {useContext} from "react";
import {auth} from "../lib/firebase/connect-api";
import {useLocalStorage} from "./useLocalStorage";
import {getEmployer} from "../lib/orm/docs";
import {Employer} from "../lib/orm/validate";
import {useAsync, UseAsyncReturn} from "../lib/hooks/useAsync";
import {useRouter} from "../routes";


export interface EmployerLocalState {
    currentEmployerID?: string
}

export type EmployerContext = {
    updateEmployer: (id: string) => void;
    newEmployer: () => void;
    useCurrents: () => UseAsyncReturn<{
        currentEmployer: Employer
        allEmployers: Employer[]
    }>
} & EmployerLocalState

export const DEFAULT_LOCAL: EmployerLocalState = {
    currentEmployerID: "",
};

const EmployerContext = React.createContext<EmployerContext>(null)

export const useEmployer = () => useContext(EmployerContext)


const EMPLOYER_KEY = [auth.currentUser.uid, 'employer'].join('/')

export const EmployerProvider: React.FC = ({children}) => {
    const router = useRouter();

    const [{currentEmployerID}, updateProviderState] = useLocalStorage(EMPLOYER_KEY, DEFAULT_LOCAL);

    const updateEmployer = (id: string) => {
        updateProviderState({currentEmployerID: id})
    };

    const newEmployer = () => {
        updateProviderState(DEFAULT_LOCAL)
    };

    const useCurrents = () => useAsync(async () => {
        let currentEmployer = await getEmployer().read(currentEmployerID);
        const allEmployers = await getEmployer().readFromCollection()
        if (!currentEmployer) {
            if (allEmployers.length > 0) {
                const currentEmployer = allEmployers[0];
                updateEmployer(currentEmployer.id);
            } else {
                await router["home/new"].push({
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
    }, [currentEmployerID], {initialState: {}});

    return <EmployerContext.Provider
        value={{
            currentEmployerID,
            useCurrents,
            updateEmployer,
            newEmployer,
        }}>{children}
    </EmployerContext.Provider>
};
