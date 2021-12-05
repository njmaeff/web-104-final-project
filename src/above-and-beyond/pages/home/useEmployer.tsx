import React, {useContext, useEffect} from "react";
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
            return await getEmployer().read(currentEmployerID);
        }
    }, [currentEmployerID], {
        initialState: {
            name: "",
            location: ""
        }
    });

    const allEmployers = useAsync(
        () => {
            return getEmployer().readFromCollection();
        }, [currentEmployerID], {
            initialState: []
        }
    )

    useEffect(() => {
        if (!currentEmployerID) {
            (async () => {
                const result = await getEmployer().readFromCollection()
                if (result.length > 0) {
                    updateEmployer(result[0].id)
                }

            })();
        }
    }, [currentEmployerID])

    const isUnsetEmployer = !!providerState.currentEmployerID

    return <EmployerContext.Provider
        value={{
            ...providerState,
            updateEmployer,
            newEmployer,
            allEmployers,
            currentEmployer,
            isUnsetEmployer
        }}>{children}
    </EmployerContext.Provider>
};
