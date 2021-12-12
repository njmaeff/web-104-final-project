import React, {useContext, useState} from "react";
import {auth} from "../lib/firebase/connect-api";

export interface GlobalState {
    currentEmployerID: string
    currentRoleID: string
}

export type GlobalStateContext = GlobalState & {
    update: (value: GlobalState) => void
}

const GlobalStateContext = React.createContext<GlobalStateContext>(null)
export const useGlobalState = () => useContext(GlobalStateContext)

const getLocalData = () => JSON.parse(localStorage.getItem(auth.currentUser.uid));
const setLocalData = (value: GlobalState) => localStorage.setItem(auth.currentUser.uid, JSON.stringify(value))

export const GlobalStateProvider: React.FC = ({children}) => {
    const [state, updateGlobalState] = useState(getLocalData());

    const update = (value: GlobalState) => {
        setLocalData(value)
        updateGlobalState(value)
    };
    return <GlobalStateContext.Provider
        value={{...state, update}}>{children}</GlobalStateContext.Provider>
};
