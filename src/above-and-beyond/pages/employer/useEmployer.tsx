import React, {useContext} from "react";
import {auth} from "../lib/firebase/connect-api";
import {useLocalStorage} from "./useLocalStorage";
import {getEmployer} from "../lib/orm/docs";
import {Employer} from "../lib/orm/validate";
import {useAsync, UseAsyncReturn} from "../lib/hooks/useAsync";


export interface EmployerLocalState {
    currentEmployerID?: string
}

export type EmployerContext = {
    updateEmployer: (id: string) => void;
    newEmployer: () => void;
    isUnsetEmployer: boolean;
    currentEmployer: UseAsyncReturn<Employer>
    allEmployers: UseAsyncReturn<Employer[]>
    isLoading: boolean
} & EmployerLocalState

export const DEFAULT_LOCAL: EmployerLocalState = {
    currentEmployerID: "",
};

const EmployerContext = React.createContext<EmployerContext>(null)

export const useEmployer = () => useContext(EmployerContext)


const EMPLOYER_KEY = [auth.currentUser.uid, 'employer'].join('/')

export const EmployerProvider: React.FC = ({children}) => {
    const [providerState, updateProviderState] = useLocalStorage(EMPLOYER_KEY, DEFAULT_LOCAL);

    const {currentEmployerID} = providerState

    const updateEmployer = (id: string) => {
        updateProviderState({currentEmployerID: id})
    };

    const newEmployer = () => {
        updateProviderState(DEFAULT_LOCAL)
    };

    const currentEmployer = useAsync(async () => {
        if (currentEmployerID) {
            return getEmployer().read(currentEmployerID);
        } else {
            const result = await getEmployer().readFromCollection()
            if (result.length > 0) {
                updateEmployer(result[0].id)
            }
        }
    }, [currentEmployerID],);

    const allEmployers = useAsync(
        () => {
            return getEmployer().readFromCollection();
        }, [currentEmployerID], {
            initialState: []
        }
    )

    const isUnsetEmployer = !!providerState.currentEmployerID
    const isLoading = currentEmployer.isInProgress || allEmployers.isInProgress

    return <EmployerContext.Provider
        value={{
            ...providerState,
            updateEmployer,
            newEmployer,
            allEmployers,
            currentEmployer,
            isUnsetEmployer,
            isLoading
        }}>{children}
    </EmployerContext.Provider>
};
